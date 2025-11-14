const pool = require('../config/db');

const createOAUTH = async ({ provider, provider_account_id, user_id }) => {
    const result = await pool.query(
        `INSERT INTO core.oauth_accounts (provider, provider_account_id, user_id)
         VALUES ($1, $2, $3)
             ON CONFLICT (provider, provider_account_id) DO NOTHING
         RETURNING *`,
        [provider, provider_account_id, user_id]
    );
    return result.rows[0] || null;
};

module.exports = {
    createOAUTH,
}