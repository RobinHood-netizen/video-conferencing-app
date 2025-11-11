import React, { useState } from 'react';
import InterviewRoom from './components/InterviewRoom';
import Scheduler from './components/Scheduler';

export default function App() {
  const [currentView, setCurrentView] = useState('scheduler');
  const [roomId, setRoomId] = useState('');
  const [userId, setUserId] = useState('');

  const joinRoom = (room, user) => {
    setRoomId(room);
    setUserId(user);
    setCurrentView('room');
  };

  const leaveRoom = () => {
    setCurrentView('scheduler');
    setRoomId('');
    setUserId('');
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Video Interview Platform</h1>
      </div>
      
      <div className="card">
        {currentView === 'scheduler' ? (
          <Scheduler onJoinRoom={joinRoom} />
        ) : (
          <InterviewRoom 
            roomId={roomId} 
            myUserId={userId} 
            onLeave={leaveRoom} 
          />
        )}
      </div>
    </div>
  );
}