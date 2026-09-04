const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('./utils/logger');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'MOVAQQAT server faol',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/students', require('./api/routes/students'));
app.use('/api/lessons', require('./api/routes/lessons'));
app.use('/api/attendance', require('./api/routes/attendance'));
app.use('/api/homework', require('./api/routes/homework'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route topilmadi',
    path: req.path
  });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error(`API xatosi: ${err.message}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server xatosi',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

module.exports = app;
