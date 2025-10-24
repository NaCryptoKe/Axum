const db = require('../config/db');

/**
 * ===============================================
 * POST VOTES MODEL — Upvotes/Downvotes for posts
 * ===============================================
 */

/**
 * Vote on a post.
 *
 * @param {string} post_id - UUID of the post.
 * @param {string} user_id - UUID of the voter.
 * @param {number} value - Either 1 (upvote) or -1 (downvote).
 * @returns {Promise<Object>} Record of the vote.
 */
exports.votePost = async (post_id, user_id, value) => {
  const result = await db.query(`
    INSERT INTO community.post_votes (post_id, user_id, value)
    VALUES ($1,$2,$3)
    ON CONFLICT (post_id,user_id) DO UPDATE SET value = EXCLUDED.value, created_at = now()
    RETURNING *
  `, [post_id, user_id, value]);
  return result.rows[0];
};
