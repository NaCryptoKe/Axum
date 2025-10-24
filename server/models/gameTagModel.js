const db = require('../config/db');

/**
 * ===============================================
 * GAME-TAG LINK MODEL — Assigns tags to games
 * ===============================================
 *
 * Links games to tags. Automatically cascades deletes when the game or tag is removed.
 */

/**
 * Assign a tag to a game.
 *
 * @param {string} game_id - UUID of the game.
 * @param {number} tag_id - ID of the tag.
 * @returns {Promise<Object>} Newly created game-tag link.
 */
exports.addTagToGame = async (game_id, tag_id) => {
  const result = await db.query(`
    INSERT INTO game_catalog.game_tags (game_id, tag_id)
    VALUES ($1,$2)
    RETURNING *
  `, [game_id, tag_id]);

  return result.rows[0];
};

/**
 * Get all tags for a specific game.
 *
 * @param {string} game_id - UUID of the game.
 * @returns {Promise<Array<Object>>} Array of tag objects linked to the game.
 */
exports.getTagsByGame = async (game_id) => {
  const result = await db.query(`
    SELECT t.* 
    FROM game_catalog.game_tags gt
    JOIN game_catalog.tags t ON gt.tag_id = t.id
    WHERE gt.game_id = $1
  `, [game_id]);

  return result.rows;
};
