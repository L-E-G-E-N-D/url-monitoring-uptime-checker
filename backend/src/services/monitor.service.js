const db = require('../db');

async function createMonitor(userId, url, checkIntervalMinutes) {
  const result = await db.query(
    `
    INSERT INTO monitors (user_id, url, check_interval_minutes)
    VALUES ($1, $2, $3)
    RETURNING id, url, check_interval_minutes, is_active, created_at
    `,
    [userId, url, checkIntervalMinutes]
  );

  const row = result.rows[0];
  return {
    id: row.id,
    url: row.url,
    checkIntervalMinutes: row.check_interval_minutes,
    isActive: row.is_active,
    createdAt: row.created_at
  };
}

async function getMonitorsByUser(userId) {
  const result = await db.query(
    `
    SELECT id, url, is_active, check_interval_minutes, created_at
    FROM monitors
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [userId]
  );

  return result.rows.map(row => ({
    id: row.id,
    url: row.url,
    isActive: row.is_active,
    checkIntervalMinutes: row.check_interval_minutes,
    createdAt: row.created_at
  }));
}

async function updateMonitor(userId, monitorId, updates) {
  const { checkIntervalMinutes, isActive } = updates;

  const result = await db.query(
    `
    UPDATE monitors
    SET
      check_interval_minutes = COALESCE($1, check_interval_minutes),
      is_active = COALESCE($2, is_active)
    WHERE id = $3 AND user_id = $4
    RETURNING id
    `,
    [checkIntervalMinutes, isActive, monitorId, userId]
  );

  return result.rowCount > 0;
}

async function deleteMonitor(userId, monitorId) {
  const result = await db.query(
    `
    DELETE FROM monitors
    WHERE id = $1 AND user_id = $2
    `,
    [monitorId, userId]
  );

  return result.rowCount > 0;
}

module.exports = {
  createMonitor,
  getMonitorsByUser,
  updateMonitor,
  deleteMonitor,
};
