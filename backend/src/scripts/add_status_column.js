const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const db = require('../db');

async function migrate() {
    try {
        console.log('Adding status column to monitors table...');
        await db.query(`
            ALTER TABLE monitors 
            ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'PENDING';
        `);
        console.log('Migration successful.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
