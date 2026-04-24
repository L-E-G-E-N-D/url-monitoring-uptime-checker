const db = require('../db');

async function getAnalyticsByMonitor(userId, monitorId) {
  const monitorResult = await db.query(
    `
    SELECT id
    FROM monitors
    WHERE id = $1 AND user_id = $2
    `,
    [monitorId, userId]
  );

  if (monitorResult.rows.length === 0) {
    return null;
  }

  const summaryResult = await db.query(
    `
    SELECT
      COUNT(*)::int AS total_checks,
      COUNT(CASE WHEN status = 'UP' THEN 1 END)::int AS up_checks,
      AVG(latency_ms)::float AS avg_latency
    FROM monitor_history
    WHERE monitor_id = $1
    `,
    [monitorId]
  );

  const historyResult = await db.query(
    `
    SELECT status, latency_ms, region, checked_at
    FROM monitor_history
    WHERE monitor_id = $1
    ORDER BY checked_at DESC
    LIMIT 20
    `,
    [monitorId]
  );

  const summary = summaryResult.rows[0];
  const totalChecks = summary.total_checks || 0;
  const upChecks = summary.up_checks || 0;
  const uptimePercentage = totalChecks > 0 ? Number(((upChecks / totalChecks) * 100).toFixed(2)) : 0;
  const avgLatency = summary.avg_latency !== null ? parseFloat(summary.avg_latency) : 0;

  return {
    uptimePercentage,
    avgLatency: Number(avgLatency.toFixed(2)),
    last20Records: historyResult.rows.map((row) => ({
      status: row.status,
      latency: row.latency_ms,
      region: row.region,
      timestamp: row.checked_at
    }))
  };
}

module.exports = {
  getAnalyticsByMonitor
};
