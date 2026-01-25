const express = require('express');
const monitorRoutes = require('./routes/monitor.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.use('/auth', authRoutes);
app.use('/monitors', monitorRoutes);

module.exports = app;
