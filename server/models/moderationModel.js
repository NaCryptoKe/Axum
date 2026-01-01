const pool = require('../config/db');

/**
 * Creates a new moderation action log.
 * @param {object} actionDetails - The details of the moderation action.
 * @param {string} actionDetails.actor_id - The user ID of the moderator performing the action.
 * @param {string} [actionDetails.target_user_id] - The user ID of the user being actioned.
 * @param {string} [actionDetails.target_entity_type] - The type of entity being actioned (e.g., 'post', 'comment').
 * @param {string} [actionDetails.target_entity_id] - The ID of the entity being actioned.
 * @param {string} actionDetails.action - The action taken (e.g., 'ban', 'delete_post').
 * @param {string} [actionDetails.reason] - The reason for the action.
 * @param {Date} [actionDetails.expires_at] - When the action expires (for temporary actions like mutes/bans).
 * @returns {Promise<object>} The created moderation action log.
 */
const createModerationAction = async ({ actor_id, target_user_id, target_entity_type, target_entity_id, action, reason, expires_at }) => {
    const query = `
        INSERT INTO core.moderation_actions (actor_id, target_user_id, target_entity_type, target_entity_id, action, reason, expires_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;
    const values = [actor_id, target_user_id, target_entity_type, target_entity_id, action, reason, expires_at];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

/**
 * Retrieves moderation actions for a specific user.
 * @param {string} target_user_id - The user ID to find actions for.
 * @param {number} [limit=50] - The maximum number of actions to return.
 * @returns {Promise<Array<object>>} A list of moderation actions.
 */
const getActionsByUser = async (target_user_id, limit = 50) => {
    const { rows } = await pool.query(
        'SELECT * FROM core.moderation_actions WHERE target_user_id = $1 ORDER BY created_at DESC LIMIT $2',
        [target_user_id, limit]
    );
    return rows;
};

/**
 * Retrieves moderation actions performed by a specific moderator.
 * @param {string} actor_id - The moderator's user ID.
 * @param {number} [limit=50] - The maximum number of actions to return.
 * @returns {Promise<Array<object>>} A list of moderation actions.
 */
const getActionsByActor = async (actor_id, limit = 50) => {
    const { rows } = await pool.query(
        'SELECT * FROM core.moderation_actions WHERE actor_id = $1 ORDER BY created_at DESC LIMIT $2',
        [actor_id, limit]
    );
    return rows;
};

module.exports = {
    createModerationAction,
    getActionsByUser,
    getActionsByActor,
};
