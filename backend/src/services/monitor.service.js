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
      last_check.checked_at as last_checked_at,
      uptime_stats.uptime_percent
    FROM monitors m
    LEFT JOIN LATERAL (
      SELECT status, response_time_ms, checked_at
      FROM monitor_checks
      WHERE monitor_id = m.id
      ORDER BY checked_at DESC
      LIMIT 1
    ) last_check ON true
    LEFT JOIN LATERAL (
      SELECT 
        ROUND(
          (COUNT(CASE WHEN status = 'UP' THEN 1 END)::DECIMAL / NULLIF(COUNT(*), 0)) * 100, 
          1
        ) as uptime_percent
      FROM monitor_checks
      WHERE monitor_id = m.id
      AND checked_at > NOW() - INTERVAL '24 hours'
    ) uptime_stats ON true
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
    uptimePercent: row.uptime_percent !== null ? parseFloat(row.uptime_percent) : null,
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

async function getMonitorById(userId, monitorId) {
  const monitorResult = await db.query(
    `
    SELECT id, url, is_active, check_interval_minutes, created_at
    FROM monitors
    WHERE id = $1 AND user_id = $2
    `,
    [monitorId, userId]
  );

  if (monitorResult.rows.length === 0) {
    return null;
  }

  const monitor = monitorResult.rows[0];

  const checksResult = await db.query(
    `
    SELECT status, response_time_ms, checked_at
    FROM monitor_checks
    WHERE monitor_id = $1
    ORDER BY checked_at DESC
    LIMIT 20
    `,
    [monitorId]
  );

  const uptimeStatsResult = await db.query(
    `
    SELECT 
      ROUND(
        (COUNT(CASE WHEN status = 'UP' THEN 1 END)::DECIMAL / NULLIF(COUNT(*), 0)) * 100, 
        1
      ) as uptime_percent
    FROM monitor_checks
    WHERE monitor_id = $1
    AND checked_at > NOW() - INTERVAL '24 hours'
    `,
    [monitorId]
  );

  return {
    id: monitor.id,
    url: monitor.url,
    isActive: monitor.is_active,
    checkIntervalMinutes: monitor.check_interval_minutes,
    createdAt: monitor.created_at,
    uptimePercent: uptimeStatsResult.rows[0] && uptimeStatsResult.rows[0].uptime_percent !== null
      ? parseFloat(uptimeStatsResult.rows[0].uptime_percent) : null,
    recentChecks: checksResult.rows.map(row => ({
      status: row.status,
      responseTime: row.response_time_ms,
      checkedAt: row.checked_at
    }))
  };
}

module.exports = {
  createMonitor,
  getMonitorsByUser,
  getMonitorById,
  updateMonitor,
  deleteMonitor,
};
