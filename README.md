# Video Conferencing Interview Platform

A simple video conferencing application for conducting interviews with recording capabilities.

## Features

- Real-time video conferencing using WebRTC
- Interview scheduling and room management
- Local video recording with upload to backend
- Socket.io for signaling
- Simple and clean UI

## Quick Start

### 1. Start the Backend Server

```bash
cd backend
npm install
npm start
```

The backend will run on `http://localhost:3001`

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

### 3. Test the Application

1. Open `http://localhost:5173` in your browser
2. Create a new interview or use room ID "test-room"
3. Enter your name and click "Join Room"
4. Open another browser tab/window and join the same room with a different name
5. Allow camera and microphone permissions when prompted
6. Start video conferencing!

## How to Demo

1. **Create Interview**: Fill in interview details and click "Create Interview"
2. **Join Room**: Use the generated room ID or "test-room" for quick testing
3. **Video Call**: Two users can join the same room for video conferencing
4. **Recording**: Click "Start Recording" to record your local video/audio
5. **Upload**: Stop recording to automatically upload to the backend

## Technical Stack

- **Frontend**: React + Vite, Socket.io-client, WebRTC
- **Backend**: Node.js + Express, Socket.io, Multer for file uploads
- **Real-time Communication**: WebRTC for peer-to-peer video/audio
- **Signaling**: Socket.io for WebRTC signaling

## Browser Requirements

- Modern browsers with WebRTC support (Chrome, Firefox, Safari, Edge)
- Camera and microphone permissions required
- HTTPS recommended for production (localhost works for development)