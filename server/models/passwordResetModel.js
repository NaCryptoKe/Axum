const db = require('../config/db');

/**
 * ===============================================
 *  PASSWORD RESET MODEL — Handles reset tokens
 * ===============================================
 *
 * Stores password reset tokens for users.  
 * Each token is:
 * - tied to a `user_id`  
 * - expires at `expires_at`  
 * - marked as used once the password is successfully reset
 * 
 * Deleting a user automatically deletes their reset tokens via `ON DELETE CASCADE`.
 */


// =========================== CRUD OPERATIONS ===============================

/**
 * Create a new password reset token for a user.
 *
 * @description
 * Generates a token entry that can be emailed to the user for password reset.
 *
 * @param {Object} params - Token data.
 * @param {string} params.token - Unique reset token (usually a UUID or secure string).
 * @param {string} params.user_id - UUID of the associated user.
 * @param {Date|string} params.expires_at - Expiration timestamp.
 *
 * @returns {Promise<Object>} A promise that resolves to the created token record.
 *
 * @example
 * const resetToken = await createPasswordResetToken({
 *   token: 'a1b2c3d4e5f6',
 *   user_id: '4e3d2c1b-1234-45ef-9d87-2f08bda8fa2a',
 *   expires_at: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
 * });
 */
exports.createPasswordResetToken = async ({ token, user_id, expires_at }) => {
  const result = await db.query(`
    INSERT INTO core.password_resets (token, user_id, expires_at)
    VALUES ($1, $2, $3)
    RETURNING token, user_id, expires_at, created_at, is_used
  `, [token, user_id, expires_at]);

  return result.rows[0];
};


/**
 * Get a password reset token by its value.
 *
 * @param {string} token - The reset token.
 * @returns {Promise<Object|null>} The token record or null if not found.
 *
 * @example
 * const tokenData = await getPasswordResetToken('a1b2c3d4e5f6');
 */
exports.getPasswordResetToken = async (token) => {
  const result = await db.query(`
    SELECT token, user_id, expires_at, created_at, is_used
    FROM core.password_resets
    WHERE token = $1
  `, [token]);

  return result.rows[0] || null;
};


/**
 * Mark a password reset token as used.
 *
 * @description
 * Called after a user successfully resets their password.
 *
 * @param {string} token - The reset token to mark as used.
 * @returns {Promise<Object|null>} The updated token record or null if not found.
 *
 * @example
 * const updated = await markTokenAsUsed('a1b2c3d4e5f6');
 */
exports.markTokenAsUsed = async (token) => {
  const result = await db.query(`
    UPDATE core.password_resets
    SET is_used = true
    WHERE token = $1
    RETURNING token, user_id, is_used, expires_at, created_at
  `, [token]);

  return result.rows[0] || null;
};


/**
 * Delete expired or used password reset tokens.
 *
 * @description
 * Can be called periodically as a cleanup job.
 *
 * @returns {Promise<number>} The number of deleted tokens.
 *
 * @example
 * const deletedCount = await cleanupPasswordResetTokens();
 */
exports.cleanupPasswordResetTokens = async () => {
  const result = await db.query(`
    DELETE FROM core.password_resets
    WHERE is_used = true OR expires_at < now()
  `);

  return result.rowCount;
};
