import React, { useState } from 'react';
import axios from 'axios';

export default function Scheduler({ onJoinRoom }) {
  const [roomId, setRoomId] = useState('');
  const [userId, setUserId] = useState('');
  const [interviewData, setInterviewData] = useState({
    title: '',
    interviewer: '',
    candidate: '',
    duration: 30
  });
  const [createdInterview, setCreatedInterview] = useState(null);

  const createInterview = async () => {
    try {
      const backendUrl = window.location.hostname.includes('vercel.app')
        ? 'https://YOUR_NEW_BACKEND_URL.vercel.app'
        : window.location.hostname === 'localhost'
          ? 'http://localhost:3001'
          : `http://${window.location.hostname}:3001`;
      
      console.log('Using backend URL:', backendUrl);
      const response = await axios.post(`${backendUrl}/api/interviews`, interviewData);
      setCreatedInterview(response.data);
      setRoomId(response.data.id);
    } catch (error) {
      console.error('Failed to create interview:', error);
      alert('Failed to create interview. Make sure backend is running.');
    }
  };

  const joinRoom = () => {
    if (!roomId.trim() || !userId.trim()) {
      alert('Please enter both Room ID and User ID');
      return;
    }
    onJoinRoom(roomId, userId);
  };

  return (
    <div>
      <div className="section">
        <h2>Create New Interview</h2>
        <div className="form-group">
          <div className="form-row">
            <input
              type="text"
              placeholder="Interview Title"
              value={interviewData.title}
              onChange={(e) => setInterviewData({...interviewData, title: e.target.value})}
            />
            <input
              type="text"
              placeholder="Interviewer Name"
              value={interviewData.interviewer}
              onChange={(e) => setInterviewData({...interviewData, interviewer: e.target.value})}
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              placeholder="Candidate Name"
              value={interviewData.candidate}
              onChange={(e) => setInterviewData({...interviewData, candidate: e.target.value})}
            />
            <input
              type="number"
              placeholder="Duration (minutes)"
              value={interviewData.duration}
              onChange={(e) => setInterviewData({...interviewData, duration: parseInt(e.target.value)})}
            />
          </div>
          <button onClick={createInterview}>✨ Create Interview</button>
        </div>
      </div>

      {createdInterview && (
        <div className="success-message">
          <h4>🎉 Interview Created Successfully!</h4>
          <p><strong>Interview ID:</strong> {createdInterview.id}</p>
          <p><strong>Title:</strong> {createdInterview.title}</p>
          <p><strong>Interviewer:</strong> {createdInterview.interviewer}</p>
          <p><strong>Candidate:</strong> {createdInterview.candidate}</p>
        </div>
      )}

      <div className="section">
        <h3>Join Interview Room</h3>
        <div className="form-group">
          <div className="form-row">
            <input
              type="text"
              placeholder="Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
            <input
              type="text"
              placeholder="Your Name/ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <button onClick={joinRoom}>🚀 Join Room</button>
          </div>
        </div>
        
        <div className="quick-test">
          <p><strong>💡 Quick Test:</strong> Use room ID "test-room" and any user name to start testing immediately.</p>
        </div>
      </div>
    </div>
  );
}