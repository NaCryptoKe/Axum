const pool = require('../config/db');

const isUserOnline = async (user_id) => {
    const result = await pool.query(
        `SELECT * FROM core.sessions
         WHERE user_id = $1
           AND last_seen_at > NOW() - INTERVAL '2 minutes'
           LIMIT 1`,
        [user_id]
    );

    return result.rows.length > 0;
};

module.exports = { isUserOnline };
