require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const mongoURI = process.env.MONGO_URI;
const authRoutes = require('./routes/auth');
const progressRoutes = require('./routes/progress');
const tasksRouter = require('./routes/task');
// const requestsRouter = require('./routes/request');

const app = express();
// app.use(cors());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://contractor-6j0k.onrender.com"
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));


app.use('/api/progress', progressRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/task', tasksRouter);
// app.use('/api/request', requestsRouter);
app.use('/public', express.static('public')); // ให้โหลดไฟล์ PDF, รูปได้

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'login.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dashboard.html'));
});

app.get('/select-project', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'select-project.html'));
});

app.get('/overview', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'overview.html'));
});

app.get('/progress', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'progress.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  app.listen(3000, () => console.log('🚀 Server running at http://localhost:3000'));
})
.catch(err => console.error('❌ MongoDB connection error:', err));
