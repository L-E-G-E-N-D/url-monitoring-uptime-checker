const db = require('../db')
const checkService = require('./check.service')
const regions = ['india', 'us', 'europe']

async function runDueChecks() {
  try {
    const query = `
      SELECT m.*, u.email as user_email
      FROM monitors m
      JOIN users u ON m.user_id = u.id
      LEFT JOIN (
        SELECT monitor_id, MAX(checked_at) as last_checked
        FROM monitor_checks
        GROUP BY monitor_id
      ) max_checks ON m.id = max_checks.monitor_id
      WHERE m.is_active = true
      AND (
        max_checks.last_checked IS NULL
        OR max_checks.last_checked < NOW() - (m.check_interval_minutes * INTERVAL '1 minute')
      )
    `

    const result = await db.query(query)
    const monitorsToCheck = result.rows

    if (monitorsToCheck.length) {
      console.log(`Scheduler: Found ${monitorsToCheck.length} monitors due for check.`)
      const checkPromises = []

      for (const monitor of monitorsToCheck) {
        for (const region of regions) {
          console.log(`Scheduler: checking ${monitor.url} from ${region}`)
          checkPromises.push(checkService.performCheck(monitor, region))
        }
      }

      await Promise.allSettled(checkPromises)
    } else {
      console.log('Scheduler: no monitors due.')
    }
  } catch (error) {
    console.error('Scheduler error:', error)
  }
}

module.exports = {
  runDueChecks,
}
