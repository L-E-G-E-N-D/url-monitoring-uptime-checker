const express = require('express');
const cors = require('cors');
const monitorRoutes = require('./routes/monitor.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://url-monitoring-uptime-checker.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.use('/auth', authRoutes);
app.use('/monitors', monitorRoutes);

module.exports = app;
