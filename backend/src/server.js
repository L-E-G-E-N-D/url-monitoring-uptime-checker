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

const db = require('./db');
const scheduler = require('./services/scheduler.service');

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    scheduler.startScheduler();
});

const gracefulShutdown = () => {
    console.log('Received kill signal, shutting down gracefully');
    server.close(() => {
        console.log('Closed out remaining connections');
        db.close().then(() => {
            console.log('Database pool closed');
            process.exit(0);
        });
    });

    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);