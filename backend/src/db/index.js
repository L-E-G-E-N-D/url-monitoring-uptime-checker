const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 2, // Limit total connections
  idleTimeoutMillis: 30000, // Close idle connections
  connectionTimeoutMillis: 2000, // Return error if connection takes too long
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL');
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  close: () => pool.end(),
};
