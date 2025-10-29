const pool = require('../config/db');

const findByIdentifier = async (identifier) => {
    const result = await pool.query(
        `SELECT * FROM core.users WHERE (username = $1 OR email = $1) AND is_deleted = false`,
        [identifier]
    );
    return result.rows[0]; // return a single user
};

const createUser = async ({ username, email, display_name, hashed_password }) => {
    const result = await pool.query(
        `INSERT INTO core.users (username, email, display_name, hashed_password)
     VALUES ($1, $2, $3, $4)
     RETURNING id, username, email, display_name, role, bio, email_verified`,
        [username, email, display_name, hashed_password]
    );

    return result.rows[0];
};

/**
 * Marks a user's email as verified
 * @param {string} user_id - UUID of the user
 * @returns {object} Updated user record
 */
const verifyUserEmail = async (user_id) => {
    const result = await pool.query(
        `UPDATE core.users
     SET email_verified = true,
         updated_at = NOW()
     WHERE id = $1
     RETURNING id, username, email, email_verified`
        ,
        [user_id]
    );

    return result.rows[0]; // returns the updated user info
};

module.exports = { findByIdentifier , createUser, verifyUserEmail };
