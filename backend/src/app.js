const express = require('express');
const monitorRoutes = require('./routes/monitor.routes');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.use('/monitors', monitorRoutes);

module.exports = app;
