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

const getUserById = async (id) => {
    const result = await pool.query('SELECT username, email FROM core.users WHERE id = $1', [id]);

    return result.rows[0];
}

const getUserByUsername = async (username) => {
    // First, check if a user exists at all
    const userCheck = await pool.query(
        `SELECT id, username, email, display_name, role, avatar_url, bio, email_verified, is_deleted
         FROM core.users
         WHERE username = $1`,
        [username]
    );

    if (userCheck.rows.length === 0) {
        // No user found
        return { error: 'No user found' };
    }

    const user = userCheck.rows[0];

    if (user.is_deleted) {
        // User is soft-deleted
        return { error: 'User has deactivated account' };
    }

    // Remove is_deleted from response if you want
    delete user.is_deleted;

    return user;
};

module.exports = { findByIdentifier , createUser, verifyUserEmail, getUserById, getUserByUsername };
