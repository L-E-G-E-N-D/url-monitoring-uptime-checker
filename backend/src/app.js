const express = require('express');
const db = require('./db');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.post('/add-monitor',async (req, res) => {
    const{url}=req.body;
    if(!url){
        return res.status(400).json({error:'URL is required'})
    }
    try{
        const result=await db.query(
            `INSERT INTO monitors (user_id, url, check_interval_minutes) VALUES ($1, $2, $3) RETURNING *`,
            ['44bec830-8701-4b6a-bd5c-61b6bb1eae15', url, 5]
        );
        res.json(result.rows[0])
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'db error' });
    }
})

app.get('/monitors', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, url, check_interval_minutes, is_active FROM monitors'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

app.delete('/monitors/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      'DELETE FROM monitors WHERE id = $1',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'monitor not found' });
    }

    res.json({ message: 'monitor deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

app.put('/monitors/:id', async (req, res) => {
  const { id } = req.params;
  const { url, check_interval_minutes, is_active } = req.body;

  try {
    const result = await db.query(
      `
      UPDATE monitors
      SET
        url = COALESCE($1, url),
        check_interval_minutes = COALESCE($2, check_interval_minutes),
        is_active = COALESCE($3, is_active)
      WHERE id = $4
      RETURNING *
      `,
      [url, check_interval_minutes, is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'monitor not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});



module.exports = app;
