const db = require('../config/db');

/**
 * ===============================================
 * TAG MODEL — Tags for games
 * ===============================================
 *
 * Tags categorize games. Can be mood-based or descriptive.
 */

/**
 * Create a new tag.
 *
 * @param {Object} params
 * @param {string} params.name - Unique tag name.
 * @param {string} [params.description] - Optional description.
 * @param {boolean} [params.is_mood_tag=false] - Whether the tag represents a mood.
 * @returns {Promise<Object>} Newly created tag record.
 */
exports.createTag = async ({ name, description, is_mood_tag = false }) => {
  const result = await db.query(`
    INSERT INTO game_catalog.tags (name, description, is_mood_tag)
    VALUES ($1,$2,$3)
    RETURNING *
  `, [name, description, is_mood_tag]);

  return result.rows[0];
};

/**
 * Get all tags.
 *
 * @returns {Promise<Array<Object>>} Array of all tags, ordered alphabetically.
 */
exports.getAllTags = async () => {
  const result = await db.query(`SELECT * FROM game_catalog.tags ORDER BY name ASC`);
  return result.rows;
};

/**
 * Get a tag by ID.
 *
 * @param {number} id - Tag ID (serial).
 * @returns {Promise<Object|null>} Tag record or null.
 */
exports.getTagById = async (id) => {
  const result = await db.query(`SELECT * FROM game_catalog.tags WHERE id = $1`, [id]);
  return result.rows[0] || null;
};
