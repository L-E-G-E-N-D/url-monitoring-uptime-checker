require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

const requiredEnvVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'EMAIL_HOST',
    'EMAIL_USER',
    'EMAIL_PASS'
];

const missing = requiredEnvVars.filter(key => !process.env[key]);

if (missing.length > 0) {
    console.error(`FATAL: Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
}

const scheduler = require('./services/scheduler.service');

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    scheduler.startScheduler();
});