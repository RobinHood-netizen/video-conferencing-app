import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SIGNALING = window.location.hostname.includes('vercel.app')
  ? 'https://video-conferencing-app-puk8.vercel.app'
  : window.location.hostname === 'localhost'
    ? 'http://localhost:3001'
    : `http://${window.location.hostname}:3001`;

export default function InterviewRoom({ roomId, myUserId, onLeave }) {
  const localRef = useRef(null);
  const remoteRef = useRef(null);
  const pcRef = useRef(null);
  const socketRef = useRef(null);
  const otherSocketRef = useRef(null);
  const [recorder, setRecorder] = useState(null);
  const [recordingUrl, setRecordingUrl] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = io(SIGNALING);
    socketRef.current = socket;
    const pc = new RTCPeerConnection({ 
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });
    pcRef.current = pc;

    pc.ontrack = (e) => {
      console.log('Received remote stream:', e.streams[0]);
      if (remoteRef.current) {
        remoteRef.current.srcObject = e.streams[0];
        remoteRef.current.volume = 1.0;
        remoteRef.current.play().catch(err => console.log('Play failed:', err));
      }
    };

    pc.onicecandidate = (e) => {
      if (e.candidate && otherSocketRef.current) {
        console.log('Sending ICE candidate');
        socket.emit('signal', { to: otherSocketRef.current, data: { ice: e.candidate } });
      }
    };

    pc.onconnectionstatechange = () => {
      console.log('Connection state:', pc.connectionState);
      setConnectionStatus(pc.connectionState);
      setIsConnected(pc.connectionState === 'connected');
    };

    let mounted = true;

    async function start() {
      try {
        console.log('Requesting media access...');
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480 }, 
          audio: true 
        });
        if (!mounted) return;
        console.log('Got local stream:', stream);
        localRef.current.srcObject = stream;
        stream.getTracks().forEach(track => {
          console.log('Adding track:', track.kind);
          pc.addTrack(track, stream);
        });

        // local recorder (records local user's camera+mic)
        const rec = new MediaRecorder(stream);
        const blobs = [];
        rec.ondataavailable = (ev) => blobs.push(ev.data);
        rec.onstop = async () => {
          const blob = new Blob(blobs, { type: 'video/webm' });
          // upload to backend
          const fd = new FormData();
          fd.append('file', blob, 'recording.webm');
          try {
            const res = await fetch(`${SIGNALING}/api/upload-recording`, { method: 'POST', body: fd });
            const json = await res.json();
            if (json && json.path) {
              setRecordingUrl(json.path);
              alert('Recording uploaded to backend (path logged in server).');
            }
          } catch (err) {
            console.error('upload failed', err);
            alert('Upload failed (check backend).');
          }
        };
        setRecorder(rec);
      } catch (err) {
        console.error('media error', err);
        alert('Could not access camera/microphone. Allow camera & mic and reload.');
      }
    }

    socket.on('connect', async () => {
      console.log('Socket connected');
      await start();
      console.log('Joining room:', roomId, myUserId);
      socket.emit('join-room', roomId, myUserId);
    });

    socket.on('user-joined', async ({ socketId, userId }) => {
      console.log('User joined:', userId, socketId);
      otherSocketRef.current = socketId;
      try {
        const offer = await pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true
        });
        await pc.setLocalDescription(offer);
        console.log('Sending offer to:', socketId);
        socket.emit('signal', { to: socketId, data: { sdp: pc.localDescription } });
      } catch (err) {
        console.error('offer error', err);
      }
    });

    socket.on('signal', async ({ from, data }) => {
      console.log('Received signal from:', from, data.sdp?.type || 'ice');
      try {
        if (data.sdp) {
          await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
          if (data.sdp.type === 'offer') {
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            console.log('Sending answer to:', from);
            socket.emit('signal', { to: from, data: { sdp: pc.localDescription } });
            otherSocketRef.current = from;
          }
        } else if (data.ice) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(data.ice));
            console.log('Added ICE candidate');
          } catch (err) {
            console.warn('Failed to add ICE candidate', err);
          }
        }
      } catch (err) {
        console.error('signal handling error', err);
      }
    });

    socket.on('user-left', ({ socketId }) => {
      if (remoteRef.current) {
        // clear remote video
        remoteRef.current.srcObject = null;
      }
      otherSocketRef.current = null;
    });

    return () => {
      mounted = false;
      if (socket) {
        socket.emit('leave-room', roomId);
        socket.disconnect();
      }
      if (pc) pc.close();
    };
  }, [roomId, myUserId]);

  const startRecording = () => recorder && recorder.start();
  const stopRecording = () => recorder && recorder.stop();

  return (
    <div>
      <div className="video-container">
        <div className="video-wrapper">
          <h3>📹 Your Video</h3>
          <video ref={localRef} autoPlay muted playsInline style={{ width: 320, height: 240 }} />
        </div>
        <div className="video-wrapper">
          <h3>📺 Remote Video</h3>
          <video ref={remoteRef} autoPlay playsInline controls style={{ width: 480, height: 360 }} />
        </div>
      </div>

      <div style={{ textAlign: 'center', margin: '1rem 0', color: isConnected ? '#059669' : '#dc2626' }}>
        Status: {connectionStatus}
      </div>

      <div className="controls">
        <button onClick={startRecording}>🔴 Start Recording</button>
        <button onClick={stopRecording}>⏹️ Stop Recording</button>
        <button onClick={onLeave}>🚪 Leave Room</button>
      </div>

      {recordingUrl && (
        <div className="recording-status">
          🎥 Recording uploaded successfully: <code>{recordingUrl}</code>
        </div>
      )}
    </div>
  );
}
