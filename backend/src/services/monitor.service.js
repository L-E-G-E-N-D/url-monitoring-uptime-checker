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
    SELECT 
      m.id, 
      m.url, 
      m.is_active, 
      m.check_interval_minutes, 
      m.created_at,
      last_check.status,
      last_check.response_time_ms,
      last_check.checked_at as last_checked_at
    FROM monitors m
    LEFT JOIN LATERAL (
      SELECT status, response_time_ms, checked_at
      FROM monitor_checks
      WHERE monitor_id = m.id
      ORDER BY checked_at DESC
      LIMIT 1
    ) last_check ON true
    WHERE m.user_id = $1
    ORDER BY m.created_at DESC
    `,
    [userId]
  );

  return result.rows.map(row => ({
    id: row.id,
    url: row.url,
    isActive: row.is_active,
    checkIntervalMinutes: row.check_interval_minutes,
    createdAt: row.created_at,
    lastCheck: row.status ? {
      status: row.status,
      responseTime: row.response_time_ms,
      checkedAt: row.last_checked_at
    } : null
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
