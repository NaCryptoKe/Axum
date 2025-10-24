const db = require('../config/db');

/**
 * GAME VERSION MODEL — Tracks specific versions of a game.
 */

/**
 * Create a new game version.
 *
 * @param {Object} params
 * @param {string} params.game_id - UUID of the game.
 * @param {string} params.version_name - Version name (e.g., "v1.0.0").
 * @param {string} [params.changelog] - Optional changelog or notes.
 * @param {'draft'|'upcoming'|'published'|'archived'} [params.status='draft']
 * @returns {Promise<Object>} Newly created game version.
 */
exports.createGameVersion = async ({ game_id, version_name, changelog, status }) => {
  const result = await db.query(`
    INSERT INTO game_catalog.game_versions (game_id, version_name, changelog, status)
    VALUES ($1,$2,$3,$4)
    RETURNING *
  `, [game_id, version_name, changelog, status]);

  return result.rows[0];
};

/**
 * Get all versions for a game.
 *
 * @param {string} game_id - Game UUID.
 * @returns {Promise<Array<Object>>} Array of game versions ordered by creation date desc.
 */
exports.getVersionsByGame = async (game_id) => {
  const result = await db.query(`
    SELECT * FROM game_catalog.game_versions WHERE game_id = $1 ORDER BY created_at DESC
  `, [game_id]);

  return result.rows;
};

/**
 * Get a specific version by ID.
 *
 * @param {string} id - Version UUID.
 * @returns {Promise<Object|null>} Version record or null.
 */
exports.getVersionById = async (id) => {
  const result = await db.query(`SELECT * FROM game_catalog.game_versions WHERE id = $1`, [id]);
  return result.rows[0] || null;
};
