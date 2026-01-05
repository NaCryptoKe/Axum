const pool = require('../config/db');

const findByIdentifier = async (identifier) => {
    const result = await pool.query(
        `SELECT * FROM core.users WHERE (username = $1 OR email = $1) AND is_deleted = false`,
        [identifier]
    );
    return result.rows[0]; // return a single user
};

const updateUserProfile = async ({ id, username, email, bio, display_name }) => {
    const result = await pool.query(
        `UPDATE core.users
         SET username = $1, email = $2, display_name = $3, bio = $4
         WHERE id = $5
             RETURNING id, username, email, display_name, role, bio, email_verified`,
        [username, email, display_name, bio, id]
    );

    return result.rows[0];
};

const updateUserProfilePicture = async ({ id, avatar_url }) => {
    const result = await pool.query(
        `UPDATE core.users
        SET avatar_url = $2
        WHERE id = $1
        RETURNING id, username, avatar_url`,
        [id, avatar_url]
    );

    return result.rows[0];
}

const softDeleteUser = async (username) => {
    const result = await pool.query(
        `UPDATE core.users
         SET is_deleted = true, deleted_at = NOW()
         WHERE username = $1
             RETURNING id, username, is_deleted, deleted_at;`,
        [username]
    );

    return result.rows[0]; // returns user info if updated
};

const createUser = async ({ firstname, lastname, username, email, hashedPassword }) => {
    const result = await pool.query(
        `INSERT INTO core.users (firstname, lastname,username, email, display_name, hashed_password)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, firstname, lastname, username, email, display_name, role, bio, email_verified`,
        [firstname, lastname,username, email, username, hashedPassword]
    );

    return result.rows[0];
};

const updatePassword = async (id, hashedPassword) => {
    const result = await pool.query(
        `UPDATE core.users
         SET hashed_password = $1,
             updated_at = NOW()
         WHERE id = $2
         RETURNING id, username, email, display_name`,
        [hashedPassword, id]
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
    const result = await pool.query('SELECT id, username, email FROM core.users WHERE id = $1', [id]);

    return result.rows[0];
}
const getUserByUsername = async (username) => {
    const userChecked = await pool.query(
        `SELECT id, username, email, display_name, role, avatar_url, bio, email_verified, is_deleted
         FROM core.users
         WHERE username = $1 AND is_deleted = false`,
        [username]
    );

    return userChecked.rows[0];
};


const getAllUsers = async () => {
    const result = await pool.query('SELECT * FROM core.users');

    return result.rows;
}

const getAllActiveUsers = async () => {
    const result = await pool.query('SELECT * FROM core.users WHERE is_deleted = false');

    return result.rows;
}

const updateUserRole = async ({ id, role }) => {
    const result = await pool.query(
        `UPDATE core.users SET role = $1, updated_at = NOW() WHERE id = $2 RETURNING id, username, role`,
        [role, id]
    );
    return result.rows[0];
};

const permanentDeleteUser = async (id) => {
    const result = await pool.query(
        `DELETE FROM core.users WHERE id = $1`,
        [id]
    );
    return result.rowCount; // 1 if deleted, 0 if not found
};

module.exports = {
    findByIdentifier,
    createUser,
    verifyUserEmail,
    getUserById,
    getUserByUsername,
    updatePassword,
    updateUserProfile,
    getAllUsers,
    getAllActiveUsers,
    updateUserProfilePicture,
    softDeleteUser,
    updateUserRole,
    permanentDeleteUser,
};
