const axios = require('axios');
const db = require('../db');
const { sendAlertEmail } = require('./alert.service');

async function performCheck(monitor) {
    const startTime = Date.now();
    let status = 'DOWN';
    let statusCode = null;
    let responseTime = 0;

    try {
        const response = await axios.get(monitor.url, {
            timeout: 5000,
            validateStatus: () => true,
        });

        const endTime = Date.now();
        responseTime = endTime - startTime;
        statusCode = response.status;

        if (response.status >= 200 && response.status < 300) {
            status = 'UP';
        } else {
            status = 'DOWN';
        }
    } catch (error) {
        const endTime = Date.now();
        responseTime = endTime - startTime;

        if (error.response) {
            statusCode = error.response.status;
        } else if (error.request) {
            statusCode = 0;
        } else {
            statusCode = 0;
        }
        status = 'DOWN';
    }

    try {
        await db.query(
            `INSERT INTO monitor_checks (monitor_id, status, response_time_ms, http_status_code)
             VALUES ($1, $2, $3, $4)`,
            [monitor.id, status, responseTime, statusCode]
        );

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
