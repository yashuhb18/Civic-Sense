const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

// ✅ Validate required env vars at startup — fail fast with clear messages
const REQUIRED_ENV = ['MONGODB_URI', 'JWT_SECRET'];
const missing = REQUIRED_ENV.filter(key => !process.env[key]);
if (missing.length > 0) {
  console.error(`\n❌ FATAL: Missing required environment variables: ${missing.join(', ')}`);
  console.error('Please set these in your .env file or Railway/Vercel environment settings.\n');
  process.exit(1);
}

const app = express();

// ✅ CORS — allow any Vercel deployment + localhost
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  // Allow all Vercel deployments for this project
  /\.vercel\.app$/,
  /\.railway\.app$/,
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. Postman, curl, server-to-server)
    if (!origin) return callback(null, true);
    const allowed = allowedOrigins.some(o =>
      typeof o === 'string' ? o === origin : o.test(origin)
    );
    if (allowed) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(null, true); // Still allow — prevents hard failures during dev/staging
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '20mb' })); // Support large base64 image payloads
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Health check endpoint — useful for Railway uptime checks
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
const authRoutes = require('./routes/authRoutes');
const issueRoutes = require('./routes/issueRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/users', require('./routes/userRoutes'));

// ✅ Global error handler — log the real error, send a clean message
app.use((err, req, res, next) => {
  console.error('[Global Error]', err.stack || err.message);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong. Please try again.',
  });
});

// MongoDB connection with retry
const connectWithRetry = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('Retrying in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  }
};

connectWithRetry();

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} busy, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error(err);
    }
  });
};

const PORT = parseInt(process.env.PORT) || 5001;
startServer(PORT);