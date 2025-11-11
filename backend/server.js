// Simple backend: Express + Socket.io + an uploads endpoint
require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';

// ensure upload dir exists
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const app = express();
app.use(cors());
app.use(express.json());

// simple in-memory interviews store
const interviews = {};

// create interview
app.post('/api/interviews', (req, res) => {
  const id = `iv-${Date.now()}`;
  const { title = 'Interview', startTime = new Date().toISOString(), duration = 30, interviewer = '', candidate = '' } = req.body;
  interviews[id] = { id, title, startTime, duration, interviewer, candidate, createdAt: new Date().toISOString() };
  res.json(interviews[id]);
});

// get interview
app.get('/api/interviews/:id', (req, res) => {
  const iv = interviews[req.params.id];
  if (!iv) return res.status(404).json({ error: 'not found' });
  res.json(iv);
});

// upload recording (multipart)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

app.post('/api/upload-recording', upload.single('file'), (req, res) => {
  // returns local path for demo purposes
  if (!req.file) return res.status(400).json({ error: 'file required' });
  const filepath = path.resolve(req.file.path);
  return res.json({ ok: true, path: filepath, filename: req.file.filename });
});

// basic health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// --- signalling server ---
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Map socketId -> { userId, roomId }
const socketMeta = new Map();

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);

  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socketMeta.set(socket.id, { roomId, userId });
    // notify others
    socket.to(roomId).emit('user-joined', { socketId: socket.id, userId });
    console.log(`${userId || 'anon'} joined ${roomId} (socket ${socket.id})`);
  });

  socket.on('signal', (payload) => {
    // payload: { to: socketId, data: {...} }
    if (payload && payload.to) {
      io.to(payload.to).emit('signal', { from: socket.id, data: payload.data });
    }
  });

  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
    const meta = socketMeta.get(socket.id) || {};
    socket.to(roomId).emit('user-left', { socketId: socket.id, userId: meta.userId });
  });

  socket.on('disconnect', () => {
    const meta = socketMeta.get(socket.id);
    if (meta && meta.roomId) {
      socket.to(meta.roomId).emit('user-left', { socketId: socket.id, userId: meta.userId });
    }
    socketMeta.delete(socket.id);
    console.log('socket disconnected', socket.id);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend + signaling server listening on http://localhost:${PORT}`);
  console.log(`Network access: http://YOUR_IP:${PORT}`);
});
