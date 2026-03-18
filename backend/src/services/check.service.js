const axios = require('axios');
const db = require('../db');
const { sendAlertEmail } = require('./alert.service');

async function handleConsecutiveDownAlert(monitor, region, time) {
    const result = await db.query(
        `SELECT status
         FROM monitor_history
         WHERE monitor_id = $1 AND region = $2
         ORDER BY checked_at DESC
         LIMIT 4`,
        [monitor.id, region]
    );

    if (result.rows.length < 3) return;

    const latestThreeDown = result.rows.slice(0, 3).every((row) => row.status === 'DOWN');
    const olderWasDown = result.rows[3] && result.rows[3].status === 'DOWN';

    if (!latestThreeDown || olderWasDown) return;

    console.log(`[ALERT] ${monitor.url} is DOWN 3 times in a row from ${region}`);
    await sendAlertEmail(
        monitor.user_email,
        monitor.url,
        `DOWN x3 (${region})`,
        time
    );
}

async function performCheck(monitor, region = 'india') {
    const startTime = Date.now();
    let endTime = startTime;
    let status = 'DOWN';
    let statusCode = null;
    let responseTime = 0;

    try {
        const response = await axios.get(monitor.url, {
            timeout: 5000,
            validateStatus: () => true,
            headers: { 'User-Agent': 'UptimeChecker/1.0' }
        });

        endTime = Date.now();
        responseTime = endTime - startTime;
        statusCode = response.status;

        if (response.status >= 200 && response.status < 300) {
            status = 'UP';
        } else {
            status = 'DOWN';
        }
    } catch (error) {
        endTime = Date.now();
        responseTime = endTime - startTime;

        if (error.response) {
            statusCode = error.response.status;
        } else if (error.code === 'ECONNABORTED') {
            statusCode = 408;
        } else {
            statusCode = 0;
        }
        status = 'DOWN';
    }

    try {
        await db.query(
            `INSERT INTO monitor_checks (monitor_id, status, response_time_ms, http_status_code, region)
             VALUES ($1, $2, $3, $4, $5)`,
            [monitor.id, status, responseTime, statusCode, region]
        );

        await db.query(
            `INSERT INTO monitor_history (monitor_id, status, latency_ms, region, checked_at)
             VALUES ($1, $2, $3, $4, $5)`,
            [monitor.id, status, responseTime, region, new Date(endTime)]
        );

        console.log(`Check result: ${monitor.url} [${region}] ${status} ${responseTime}ms`)

        if (status === 'DOWN') {
            await handleConsecutiveDownAlert(monitor, region, endTime);
        }

        if (monitor.status !== status) {
            console.log(`[ALERT] Monitor ${monitor.url} changed from ${monitor.status || 'PENDING'} to ${status}`);

            await sendAlertEmail(
                monitor.user_email,
                monitor.url,
                status,
                endTime
            );

            await db.query(
                `UPDATE monitors SET status = $1 WHERE id = $2`,
                [status, monitor.id]
            );
        }

    } catch (dbError) {
        console.error('Failed to record check result:', dbError);
    }
}

module.exports = {
    performCheck,
};
