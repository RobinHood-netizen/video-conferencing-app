# 🎥 Video Conferencing Platform - Demo Guide

## Quick Demo Steps

### 1. Start the Application
```bash
./start.sh
```
Or manually:
```bash
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

### 2. Open the Application
- Open `http://localhost:5173` in your browser
- You should see the "Video Interview Platform" interface

### 3. Demo Scenario 1: Quick Test
1. **Join Room**: 
   - Room ID: `test-room`
   - Your Name: `Interviewer`
   - Click "Join Room"

2. **Second User** (open new browser tab/window):
   - Room ID: `test-room` 
   - Your Name: `Candidate`
   - Click "Join Room"

3. **Allow Permissions**: Grant camera and microphone access when prompted

4. **Video Call**: You should now see both video streams

### 4. Demo Scenario 2: Full Interview Flow
1. **Create Interview**:
   - Title: `Senior Developer Interview`
   - Interviewer: `John Smith`
   - Candidate: `Jane Doe`
   - Duration: `45` minutes
   - Click "Create Interview"

2. **Copy Room ID**: Note the generated interview ID (e.g., `iv-1234567890`)

3. **Join as Interviewer**:
   - Room ID: Use the generated ID
   - Your Name: `John Smith`
   - Click "Join Room"

4. **Join as Candidate** (new tab):
   - Room ID: Same generated ID
   - Your Name: `Jane Doe`
   - Click "Join Room"

### 5. Test Recording Feature
1. Once both users are connected
2. Click "Start Recording (local)" 
3. Speak for a few seconds
4. Click "Stop Recording"
5. Recording will be uploaded to backend automatically
6. Check console for upload confirmation

## 🎯 Key Features to Demonstrate

- ✅ **Real-time Video**: WebRTC peer-to-peer connection
- ✅ **Interview Scheduling**: Create structured interviews
- ✅ **Room Management**: Join/leave rooms seamlessly  
- ✅ **Recording**: Local video recording with backend upload
- ✅ **Responsive UI**: Clean, professional interface

## 🔧 Troubleshooting

**Camera/Mic not working?**
- Ensure browser permissions are granted
- Try refreshing the page
- Check if other apps are using camera/mic

**Connection issues?**
- Verify both backend (3001) and frontend (5173) are running
- Check browser console for errors
- Try using Chrome/Firefox for best WebRTC support

**Recording not uploading?**
- Check backend console for upload logs
- Ensure `uploads/` directory exists in backend folder
- Verify backend API is accessible at localhost:3001