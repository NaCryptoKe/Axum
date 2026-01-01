const pool = require('../config/db');

/* =====================================================
    SPACES
===================================================== */

const createSpace = async ({ creator_id, related_game_id, name, slug, description }) => {
    const { rows } = await pool.query(
        `INSERT INTO community.spaces (creator_id, related_game_id, name, slug, description)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [creator_id, related_game_id, name, slug, description]
    );
    return rows[0];
};

const getSpaceBySlug = async (slug) => {
    const { rows } = await pool.query(
        'SELECT * FROM community.spaces WHERE slug = $1 AND is_deleted = false',
        [slug]
    );
    return rows[0];
};

const softDeleteSpace = async (id) => {
    const { rows } = await pool.query(
        'UPDATE community.spaces SET is_deleted = true, deleted_at = NOW() WHERE id = $1 RETURNING *',
        [id]
    );
    return rows[0];
};

/* =====================================================
    POSTS
===================================================== */

const createPost = async ({ space_id, author_id, title, body }) => {
    const { rows } = await pool.query(
        `INSERT INTO community.posts (space_id, author_id, title, body)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [space_id, author_id, title, body]
    );
    return rows[0];
};

const getPostById = async (id) => {
    const { rows } = await pool.query(
        'SELECT * FROM community.posts WHERE id = $1 AND is_deleted = false',
        [id]
    );
    return rows[0];
};

const getPostsBySpace = async (space_id, limit = 20, offset = 0) => {
    const { rows } = await pool.query(
        `SELECT * FROM community.posts 
        WHERE space_id = $1 AND is_deleted = false 
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3`,
        [space_id, limit, offset]
    );
    return rows;
};

const softDeletePost = async (id) => {
    const { rows } = await pool.query(
        'UPDATE community.posts SET is_deleted = true, deleted_at = NOW() WHERE id = $1 RETURNING *',
        [id]
    );
    return rows[0];
};

/* =====================================================
    COMMENTS
===================================================== */

const createComment = async ({ post_id, author_id, parent_comment_id, body }) => {
    const { rows } = await pool.query(
        `INSERT INTO community.comments (post_id, author_id, parent_comment_id, body)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [post_id, author_id, parent_comment_id, body]
    );
    return rows[0];
};

const getCommentsByPost = async (post_id) => {
    const { rows } = await pool.query(
        'SELECT * FROM community.comments WHERE post_id = $1 AND is_deleted = false ORDER BY created_at ASC',
        [post_id]
    );
    return rows;
};

const softDeleteComment = async (id) => {
    const { rows } = await pool.query(
        'UPDATE community.comments SET is_deleted = true, deleted_at = NOW() WHERE id = $1 RETURNING *',
        [id]
    );
    return rows[0];
};

/* =====================================================
    VOTES
===================================================== */

const voteOnPost = async (post_id, user_id, value) => {
    const { rows } = await pool.query(
        `INSERT INTO community.post_votes (post_id, user_id, value)
        VALUES ($1, $2, $3)
        ON CONFLICT (post_id, user_id) DO UPDATE SET value = EXCLUDED.value
        RETURNING *`,
        [post_id, user_id, value]
    );
    return rows[0];
};

module.exports = {
    // Spaces
    createSpace,
    getSpaceBySlug,
    softDeleteSpace,
    // Posts
    createPost,
    getPostById,
    getPostsBySpace,
    softDeletePost,
    // Comments
    createComment,
    getCommentsByPost,
    softDeleteComment,
    // Votes
    voteOnPost,
};
