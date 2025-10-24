const db = require('../config/db');

/**
 * ===============================================
 * POST MODEL — Posts within spaces
 * ===============================================
 */

/**
 * Create a new post in a space.
 *
 * @param {Object} params
 * @param {string} params.space_id - UUID of the space.
 * @param {string} [params.author_id] - UUID of the user creating the post.
 * @param {string} params.title - Post title.
 * @param {string} [params.body] - Post body.
 * @returns {Promise<Object>} Newly created post.
 */
exports.createPost = async ({ space_id, author_id, title, body }) => {
  const result = await db.query(`
    INSERT INTO community.posts
      (space_id, author_id, title, body)
    VALUES ($1,$2,$3,$4)
    RETURNING *
  `, [space_id, author_id, title, body]);
  return result.rows[0];
};

/**
 * Get all posts in a space.
 *
 * @param {string} space_id - UUID of the space.
 * @returns {Promise<Array<Object>>} Array of posts (non-deleted).
 */
exports.getPostsBySpace = async (space_id) => {
  const result = await db.query(`
    SELECT * FROM community.posts
    WHERE space_id = $1 AND is_deleted = false
    ORDER BY created_at DESC
  `, [space_id]);
  return result.rows;
};
