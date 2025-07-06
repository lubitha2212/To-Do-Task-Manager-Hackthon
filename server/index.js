const express = require('express');
const passport = require('passport');
const session = require('cookie-session');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();
require('./passport');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  name: 'session',
  keys: [process.env.SESSION_SECRET],
  maxAge: 24 * 60 * 60 * 1000,
}));

app.use(passport.initialize());
app.use(passport.session());

connectDB();

app.use('/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const http = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log('🟢 Connected:', socket.id);
  socket.on('disconnect', () => console.log('🔴 Disconnected:', socket.id));
});

const PORT = process.env.PORT || 5000;
http.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
