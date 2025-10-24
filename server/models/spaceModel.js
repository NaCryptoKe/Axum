const db = require('../config/db');

/**
 * ===============================================
 * SPACE MODEL — Discussion spaces (similar to Steam Communities)
 * ===============================================
 */

/**
 * Create a new space.
 *
 * @param {Object} params
 * @param {string} params.creator_id - UUID of the user creating the space.
 * @param {string} [params.related_game_id] - UUID of the related game (nullable).
 * @param {string} params.name - Name of the space.
 * @param {string} params.slug - URL-friendly slug.
 * @param {string} [params.description] - Optional description.
 * @returns {Promise<Object>} Newly created space.
 */
exports.createSpace = async ({ creator_id, related_game_id, name, slug, description }) => {
  const result = await db.query(`
    INSERT INTO community.spaces 
      (creator_id, related_game_id, name, slug, description)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *
  `, [creator_id, related_game_id, name, slug, description]);
  return result.rows[0];
};

/**
 * Get all spaces.
 *
 * @returns {Promise<Array<Object>>} Array of all active spaces.
 */
exports.getAllSpaces = async () => {
  const result = await db.query(`
    SELECT * FROM community.spaces
    WHERE is_deleted = false
    ORDER BY created_at DESC
  `);
  return result.rows;
};
