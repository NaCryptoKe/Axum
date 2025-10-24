const db = require('../config/db');

/**
 * ===============================================
 *  SESSION MODEL — Handles authentication sessions
 * ===============================================
 *
 * Represents active login sessions tied to users.
 * Each session has:
 * - `user_id`: links to the `core.users` table.
 * - `ip_address` + `user_agent`: for security tracking.
 * - `expires_at`: determines session validity.
 * 
 * When a user is deleted, their sessions are automatically
 * removed via `ON DELETE CASCADE`.
 */

// =========================== CRUD OPERATIONS ===============================

/**
 * Create a new session record.
 *
 * @description
 * Inserts a new session into `core.sessions` for a given user,
 * usually after successful authentication.
 *
 * @param {Object} params - Session data.
 * @param {string} params.user_id - UUID of the associated user.
 * @param {string} [params.user_agent] - Optional browser or device info.
 * @param {string} [params.ip_address] - Optional client IP address.
 * @param {Date|string} params.expires_at - Expiration timestamp (ISO string or JS Date).
 *
 * @returns {Promise<Object>} A promise that resolves to the created session record.
 *
 * @example
 * const session = await createSession({
 *   user_id: '4e3d2c1b...',
 *   user_agent: 'Mozilla/5.0 (Linux; x64)',
 *   ip_address: '192.168.1.12',
 *   expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
 * });
 */
exports.createSession = async ({ user_id, user_agent, ip_address, expires_at }) => {
  const result = await db.query(`
    INSERT INTO core.sessions (user_id, user_agent, ip_address, expires_at)
    VALUES ($1, $2, $3, $4)
    RETURNING id, user_id, user_agent, ip_address, created_at, last_seen_at, expires_at
  `, [user_id, user_agent, ip_address, expires_at]);

  return result.rows[0];
};


/**
 * Get all active sessions for a specific user.
 *
 * @param {string} user_id - UUID of the user.
 * @returns {Promise<Array<Object>>} A list of active sessions.
 *
 * @example
 * const sessions = await getUserSessions('4e3d2c1b...');
 */
exports.getUserSessions = async (user_id) => {
  const result = await db.query(`
    SELECT id, user_id, user_agent, ip_address, created_at, last_seen_at, expires_at
    FROM core.sessions
    WHERE user_id = $1
    ORDER BY created_at DESC
  `, [user_id]);

  return result.rows;
};


/**
 * Update the `last_seen_at` timestamp for a session.
 *
 * @description
 * Useful for tracking activity (e.g., on API request or heartbeat).
 *
 * @param {string} id - UUID of the session.
 * @returns {Promise<Object|null>} Updated session or null if not found.
 *
 * @example
 * const updated = await updateLastSeen('session-id-1234');
 */
exports.updateLastSeen = async (id) => {
  const result = await db.query(`
    UPDATE core.sessions
    SET last_seen_at = now()
    WHERE id = $1
    RETURNING id, user_id, last_seen_at
  `, [id]);

  return result.rows[0];
};


/**
 * Delete a session by its ID.
 *
 * @description
 * Commonly used for logging out a single device/session.
 *
 * @param {string} id - UUID of the session to delete.
 * @returns {Promise<Object|null>} The deleted session record or null.
 *
 * @example
 * const deleted = await deleteSession('session-id-5678');
 */
exports.deleteSession = async (id) => {
  const result = await db.query(`
    DELETE FROM core.sessions
    WHERE id = $1
    RETURNING id, user_id, user_agent
  `, [id]);

  return result.rows[0];
};


/**
 * Delete all sessions belonging to a user.
 *
 * @description
 * Used for "Log out from all devices" functionality.
 *
 * @param {string} user_id - UUID of the user.
 * @returns {Promise<number>} The number of deleted sessions.
 *
 * @example
 * const count = await deleteUserSessions('user-id-1234');
 * console.log(`${count} sessions terminated.`);
 */
exports.deleteUserSessions = async (user_id) => {
  const result = await db.query(`
    DELETE FROM core.sessions
    WHERE user_id = $1
  `, [user_id]);

  return result.rowCount;
};
