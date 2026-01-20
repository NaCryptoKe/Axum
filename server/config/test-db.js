// test-db.js
const path = require('path');
// Manually pointing to the parent directory for the test script
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const pool = require('./db'); 

async function checkConnection() {
    console.log('--- Debugging Info ---');
    console.log('Current Directory:', __dirname);
    console.log('DATABASE_URL loaded:', process.env.DATABASE_URL ? '✅ Yes' : '❌ No');
    
    if (!process.env.DATABASE_URL) {
        console.error('Aborting: No DATABASE_URL found. Check your .env file path.');
        return;
    }

    try {
        console.log('\n🔄 Attempting to connect to Supabase...');
        const res = await pool.query('SELECT NOW()');
        console.log('✅ Connection Successful!');
        console.log('🕒 Database Time:', res.rows[0].now);
    } catch (err) {
        console.error('❌ Connection Error:', err.message);
        
        if (err.message.includes('SSL')) {
            console.log('\n💡 Fix: Make sure your pool config has: ssl: { rejectUnauthorized: false }');
        }
    } finally {
        await pool.end();
    }
}

checkConnection();