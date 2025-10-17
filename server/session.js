const express = require('express');
const session = require('express-session');
const { Pool } = require('pg');
const crypto = require('crypto');

const app = express();
app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'axumarcade',
    password: 'maximus',
    port: 5432,
});

// Helper to generate random session IDs
function generateSessionId() {
    return crypto.randomBytes(16).toString('hex');
}

// Middleware to load session from PostgreSQL
app.use(async (req, res, next) => {
    const sid = req.headers['x-session-id']; // we'll send this in terminal requests
    if (!sid) {
        req.session = {};
        return next();
    }

    try {
        const result = await pool.query(
            'SELECT data FROM sessions WHERE session_id = $1',
            [sid]
        );
        if (result.rows.length > 0) {
            req.session = result.rows[0].data;
        } else {
            req.session = {};
        }
    } catch (err) {
        console.error(err);
        req.session = {};
    }
    next();
});

// Login route
app.post('/login', async (req, res) => {
    const { username } = req.body;
    const sessionId = generateSessionId();
    const sessionData = { username };

    await pool.query(
        'INSERT INTO sessions (session_id, data) VALUES ($1, $2)',
        [sessionId, sessionData]
    );

    res.json({ message: `Logged in as ${username}`, sessionId });
});

// Protected route
app.get('/dashboard', (req, res) => {
    if (!req.session.username) {
        return res.status(401).json({ error: 'Not logged in' });
    }
    res.json({ message: `Welcome back ${req.session.username}` });
});

app.listen(3000, () => console.log('Server running on port 3000'));
