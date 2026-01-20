const pool = require('../config/db');

const generateNewToken = async (user_id, token, expiresAt) => {
    const result = await pool.query(
        `INSERT INTO core.password_resets (user_id, token, expires_at) VALUES ($1, $2, $3)
        RETURNING created_at`,
        [user_id, token, expiresAt]);

    return result.rows[0];
}

const verifyToken = async (token) => {
    const result = await pool.query(
        `SELECT * FROM core.password_resets WHERE token = $1 AND expires_at > NOW() AND is_used = false`,
        [token]
    );

    if (result.rows.length === 0) return { valid: false, message: 'Invalid or expired token' };
    return { valid: true, reset: result.rows[0] };
};

const markUsed = async (token) => {
    const result = await pool.query(`UPDATE core.password_resets SET is_used = true WHERE token = $1`, [token]);
}

// models/passwordReset.js
const invalidateToken = async (token) => {
    return await pool.query(
        `DELETE FROM core.password_resets WHERE token = $1`,
        [token]
    );
}

module.exports = { generateNewToken, verifyToken, markUsed, invalidateToken };