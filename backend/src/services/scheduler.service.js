const db = require('../db');
const checkService = require('./check.service');

const CHECK_INTERVAL_MS = 60 * 1000;

async function runChecks() {
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
        `;

        const result = await db.query(query);
        const monitorsToCheck = result.rows;

        if (monitorsToCheck.length > 0) {
            console.log(`Scheduler: Found ${monitorsToCheck.length} monitors due for check.`);

            const checkPromises = monitorsToCheck.map(monitor => checkService.performCheck(monitor));
            await Promise.allSettled(checkPromises);
        }
    } catch (error) {
        console.error('Scheduler error:', error);
    }
}

async function startScheduler() {
    console.log('Starting monitoring scheduler...');

    runChecks();

    setInterval(runChecks, CHECK_INTERVAL_MS);
}

module.exports = {
    startScheduler,
};
