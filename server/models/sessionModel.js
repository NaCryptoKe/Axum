const { session } = require('passport');
const pool = require('../config/db');
const UAParser = require('ua-parser-js');

const createSession = async (user_id, user_agent, ip_address, expires_at) => {
    const parser = new UAParser(user_agent);
    const browser = parser.getBrowser().name;
    const device = parser.getDevice().model || parser.getOS().name;

    // 🧹 Step 1: Remove any duplicate session from same device
    await pool.query(
        `DELETE FROM core.sessions
         WHERE user_id = $1
           AND ip_address = $2
           AND user_agent = $3`,
        [user_id, ip_address, user_agent]
    );

    // 🆕 Step 2: Insert new session
    const result = await pool.query(
        `INSERT INTO core.sessions (user_id, user_agent, ip_address, expires_at, browser, device)
         VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
        [user_id, user_agent, ip_address, expires_at, browser, device]
    );

    return result.rows[0];
};

const getSessionById = async (session_id) => {
    const result = await pool.query(
        `SELECT *
        FROM core.sessions
        WHERE id = $1`,
        [session_id]
    );

    return result.rows[0]; // return the session object or undefined if not found
};

const updateLastSeen = async (session_id) => {
    const result = await pool.query(
        `UPDATE core.sessions
         SET last_seen_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [session_id]
    );

    return result.rows[0];
};

const getAllUsersSession = async (user_id) => {
    const result = await pool.query(
        `SELECT * FROM core.sessions
        WHERE user_id = $1`,
        [user_id]
    )

    return result.rows;
}

const deleteSession = async (session_id) => {
    const result = await pool.query(
        `DELETE FROM core.sessions WHERE id = $1 RETURNING *`,
        [session_id]
    );

    return result.rows[0];
};


const expireSession = async (session_id) => {
    await pool.query(
        `UPDATE core.sessions SET expires_at = NOW() WHERE id = $1`,
        [session_id]
    );
};


module.exports = { createSession, updateLastSeen, expireSession, getAllUsersSession, deleteSession, getSessionById };
