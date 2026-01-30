const axios = require('axios');
const db = require('../db');

/**
 * Performs a check for a single monitor and records the result.
 * @param {Object} monitor - The monitor object (must contain id, url).
 */
async function performCheck(monitor) {
    const startTime = Date.now();
    let status = 'DOWN';
    let statusCode = null;
    let responseTime = 0;

    try {
        const response = await axios.get(monitor.url, {
            timeout: 5000, // 5 second timeout
            validateStatus: () => true, // resolve promise for all status codes
        });

        const endTime = Date.now();
        responseTime = endTime - startTime;
        statusCode = response.status;

        // Consider 2xx as UP for now.
        // We can make this configurable later.
        if (response.status >= 200 && response.status < 300) {
            status = 'UP';
        } else {
            status = 'DOWN';
        }
    } catch (error) {
        // Network error, DNS error, timeout, etc.
        const endTime = Date.now();
        responseTime = endTime - startTime;

        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx (if validateStatus wasn't true)
            // But with validateStatus: true, we mostly catch network errors here.
            statusCode = error.response.status;
        } else if (error.request) {
            // The request was made but no response was received
            statusCode = 0; // Custom code for no response
        } else {
            // Something happened in setting up the request that triggered an Error
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
        // console.log(\`Checked \${monitor.url}: \${status} (\${responseTime}ms)\`);
    } catch (dbError) {
        console.error('Failed to record check result:', dbError);
    }
}

module.exports = {
    performCheck,
};
