const db = require('../config/db');

/**
 * ===============================================
 * GAME REVIEW MODEL — User reviews for games
 * ===============================================
 *
 * Stores ratings and text reviews per user per game.
 * Soft deletion supported.
 */

/**
 * Add a review for a game.
 *
 * @param {Object} params
 * @param {string} params.game_id - UUID of the game.
 * @param {string} params.user_id - UUID of the reviewer.
 * @param {number} params.rating - Rating between 1 and 5.
 * @param {string} [params.title] - Optional review title.
 * @param {string} [params.body] - Optional review body.
 * @returns {Promise<Object>} Newly created review record.
 */
exports.addReview = async ({ game_id, user_id, rating, title, body }) => {
  const result = await db.query(`
    INSERT INTO game_catalog.game_reviews
      (game_id, user_id, rating, title, body)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *
  `, [game_id, user_id, rating, title, body]);

  return result.rows[0];
};

/**
 * Get all reviews for a specific game.
 *
 * @param {string} game_id - UUID of the game.
 * @returns {Promise<Array<Object>>} Array of active (non-deleted) reviews.
 */
exports.getReviewsByGame = async (game_id) => {
  const result = await db.query(`
    SELECT * 
    FROM game_catalog.game_reviews
    WHERE game_id = $1 AND is_deleted = false
    ORDER BY created_at DESC
  `, [game_id]);

  return result.rows;
};

/**
 * Soft delete a review.
 *
 * @param {string} game_id - UUID of the game.
 * @param {string} user_id - UUID of the user who wrote the review.
 * @returns {Promise<Object|null>} Soft-deleted review record or null if not found.
 */
exports.softDeleteReview = async (game_id, user_id) => {
  const result = await db.query(`
    UPDATE game_catalog.game_reviews
    SET is_deleted = true, deleted_at = now()
    WHERE game_id = $1 AND user_id = $2
    RETURNING *
  `, [game_id, user_id]);

  return result.rows[0] || null;
};
