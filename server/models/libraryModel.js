const db = require('../config/db');

/**
 * ===============================================
 * LIBRARY MODEL — User game library
 * ===============================================
 */

/**
 * Add a game to a user's library.
 *
 * @param {string} user_id - UUID of the user.
 * @param {string} game_id - UUID of the game.
 * @returns {Promise<Object>} Newly added library record.
 */
exports.addGameToLibrary = async (user_id, game_id) => {
  const result = await db.query(`
    INSERT INTO player_data.libraries (user_id, game_id)
    VALUES ($1,$2)
    RETURNING *
  `, [user_id, game_id]);
  return result.rows[0];
};

/**
 * Get all games in a user's library.
 *
 * @param {string} user_id - UUID of the user.
 * @returns {Promise<Array<Object>>} Array of library records, ordered by last played.
 */
exports.getUserLibrary = async (user_id) => {
  const result = await db.query(`
    SELECT * FROM player_data.libraries
    WHERE user_id = $1
    ORDER BY last_played_at DESC NULLS LAST
  `, [user_id]);
  return result.rows;
};
