const db = require('../config/db');

/**
 * ===============================================
 * COMMENT MODEL — Comments on posts (supports nested comments)
 * ===============================================
 */

/**
 * Create a comment on a post.
 *
 * @param {Object} params
 * @param {string} params.post_id - UUID of the post.
 * @param {string} [params.author_id] - UUID of the commenter.
 * @param {string} [params.parent_comment_id] - UUID of parent comment for replies.
 * @param {string} params.body - Comment body.
 * @returns {Promise<Object>} Newly created comment.
 */
exports.createComment = async ({ post_id, author_id, parent_comment_id, body }) => {
  const result = await db.query(`
    INSERT INTO community.comments
      (post_id, author_id, parent_comment_id, body)
    VALUES ($1,$2,$3,$4)
    RETURNING *
  `, [post_id, author_id, parent_comment_id, body]);
  return result.rows[0];
};

/**
 * Get all comments for a post.
 *
 * @param {string} post_id - UUID of the post.
 * @returns {Promise<Array<Object>>} Array of comments (non-deleted).
 */
exports.getCommentsByPost = async (post_id) => {
  const result = await db.query(`
    SELECT * FROM community.comments
    WHERE post_id = $1 AND is_deleted = false
    ORDER BY created_at ASC
  `, [post_id]);
  return result.rows;
};
