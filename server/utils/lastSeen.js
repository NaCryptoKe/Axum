const pool = require('../config/db');

const lastSeen = async (user_id) => {
    const result = await pool.query(
        `SELECT last_seen_at
         FROM core.sessions
         WHERE user_id = $1
         ORDER BY last_seen_at DESC
             LIMIT 1`,
        [user_id]
    );

    if (result.rows.length === 0) return null;
    return result.rows[0].last_seen_at;
};

module.exports = { lastSeen };
