const express = require('express');
const db = require('./db');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.get('/db-test', async (req, res) => {
  const result = await db.query('SELECT NOW()');
  res.json({ time: result.rows[0].now });
});

module.exports = app;
