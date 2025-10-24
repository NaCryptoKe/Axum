const db = require('../config/db');

/**
 * ===============================================
 *  MODERATION ACTION MODEL — Logs moderation activities
 * ===============================================
 *
 * Tracks actions performed by moderators/admins on users or content.
 * Includes temporary bans, content deletions, warnings, etc.
 * 
 * Referential notes:
 * - `actor_id` and `target_user_id` reference `core.users.id`.
 * - On user deletion, the fields are set to NULL (`ON DELETE SET NULL`) to preserve logs.
 */

// =========================== CRUD OPERATIONS ===============================

/**
 * Log a new moderation action.
 *
 * @param {Object} params - Moderation action data.
 * @param {string|null} params.actor_id - UUID of the moderator/admin performing the action.
 * @param {string|null} params.target_user_id - UUID of the user affected by the action.
 * @param {string} params.target_entity_type - Type of entity affected ('post', 'comment', 'game', 'user', etc.).
 * @param {string|null} params.target_entity_id - UUID of the entity affected (if applicable).
 * @param {string} params.action - Action performed ('ban', 'delete_post', 'warn', etc.).
 * @param {string} [params.reason] - Optional reason for the action.
 * @param {Date|string} [params.expires_at] - Optional expiry date (for temporary bans, warnings, etc.).
 *
 * @returns {Promise<Object>} The newly created moderation action record.
 *
 * @example
 * const log = await logModerationAction({
 *   actor_id: 'a1b2c3d4-...',
 *   target_user_id: 'b4f5e6f7-...',
 *   target_entity_type: 'game',
 *   target_entity_id: 'c1d2e3f4-...',
 *   action: 'delete_post',
 *   reason: 'Inappropriate content',
 *   expires_at: null
 * });
 */
exports.logModerationAction = async ({ actor_id, target_user_id, target_entity_type, target_entity_id, action, reason, expires_at }) => {
  const result = await db.query(`
    INSERT INTO core.moderation_actions 
      (actor_id, target_user_id, target_entity_type, target_entity_id, action, reason, expires_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, actor_id, target_user_id, target_entity_type, target_entity_id, action, reason, expires_at, created_at
  `, [actor_id, target_user_id, target_entity_type, target_entity_id, action, reason, expires_at]);

  return result.rows[0];
};


/**
 * Get a moderation action by its ID.
 *
 * @param {string} id - UUID of the moderation action.
 * @returns {Promise<Object|null>} The moderation action record, or null if not found.
 *
 * @example
 * const action = await getModerationActionById('f9d3c2b1-...');
 */
exports.getModerationActionById = async (id) => {
  const result = await db.query(`
    SELECT * 
    FROM core.moderation_actions
    WHERE id = $1
  `, [id]);

  return result.rows[0] || null;
};


/**
 * Get all moderation actions for a target user.
 *
 * @param {string} target_user_id - UUID of the target user.
 * @returns {Promise<Array<Object>>} List of moderation actions affecting the user.
 *
 * @example
 * const logs = await getModerationActionsByUser('b4f5e6f7-...');
 */
exports.getModerationActionsByUser = async (target_user_id) => {
  const result = await db.query(`
    SELECT * 
    FROM core.moderation_actions
    WHERE target_user_id = $1
    ORDER BY created_at DESC
  `, [target_user_id]);

  return result.rows;
};


/**
 * Get all moderation actions performed by a specific moderator/admin.
 *
 * @param {string} actor_id - UUID of the actor.
 * @returns {Promise<Array<Object>>} List of actions performed by the actor.
 *
 * @example
 * const logs = await getModerationActionsByActor('a1b2c3d4-...');
 */
exports.getModerationActionsByActor = async (actor_id) => {
  const result = await db.query(`
    SELECT * 
    FROM core.moderation_actions
    WHERE actor_id = $1
    ORDER BY created_at DESC
  `, [actor_id]);

  return result.rows;
};


/**
 * Delete a moderation action by ID (hard delete).
 *
 * @param {string} id - UUID of the moderation action to delete.
 * @returns {Promise<Object|null>} Deleted moderation action record, or null if not found.
 *
 * @example
 * const deleted = await deleteModerationAction('f9d3c2b1-...');
 */
exports.deleteModerationAction = async (id) => {
  const result = await db.query(`
    DELETE FROM core.moderation_actions
    WHERE id = $1
    RETURNING *
  `, [id]);

  return result.rows[0] || null;
};
