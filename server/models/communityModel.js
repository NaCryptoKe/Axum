const pool = require('../config/db');

// --- Space Functions ---
const createSpace = async ({ creator_id, related_game_id, name, slug, description }) => {
    const { rows } = await pool.query(
        `INSERT INTO community.spaces (creator_id, related_game_id, name, slug, description)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [creator_id, related_game_id, name, slug, description]
    );
    return rows[0];
};

const getSpaceById = async (id) => {
    const { rows } = await pool.query(
        'SELECT * FROM community.spaces WHERE id = $1 AND is_deleted = false',
        [id]
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

const updateSpace = async (id, { name, slug, description }) => {
    const { rows } = await pool.query(
        `UPDATE community.spaces
        SET name = COALESCE($1, name),
            slug = COALESCE($2, slug),
            description = COALESCE($3, description),
            updated_at = NOW()
        WHERE id = $4 AND is_deleted = false
        RETURNING *`,
        [name, slug, description, id]
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

// --- Post Functions ---
const createPost = async ({ space_id, author_id, title, body }) => {
    const { rows } = await pool.query(
        `INSERT INTO community.posts (space_id, author_id, title, body)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
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

const getPostsBySpace = async (space_id) => {
    const { rows } = await pool.query(
        'SELECT * FROM community.posts WHERE space_id = $1 AND is_deleted = false ORDER BY created_at DESC',
        [space_id]
    );
    return rows;
};

const updatePost = async (id, { title, body }) => {
    const { rows } = await pool.query(
        `UPDATE community.posts
        SET title = COALESCE($1, title),
            body = COALESCE($2, body),
            updated_at = NOW()
        WHERE id = $3 AND is_deleted = false
        RETURNING *`,
        [title, body, id]
    );
    return rows[0];
};

const softDeletePost = async (id) => {
    const { rows } = await pool.query(
        'UPDATE community.posts SET is_deleted = true, deleted_at = NOW() WHERE id = $1 RETURNING *',
        [id]
    );
    return rows[0];
};

// --- Comment Functions ---
const createComment = async ({ post_id, author_id, parent_comment_id, body }) => {
    const { rows } = await pool.query(
        `INSERT INTO community.comments (post_id, author_id, parent_comment_id, body)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [post_id, author_id, parent_comment_id, body]
    );
    return rows[0];
};

const getCommentById = async (id) => {
    const { rows } = await pool.query(
        'SELECT * FROM community.comments WHERE id = $1 AND is_deleted = false',
        [id]
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

const updateComment = async (id, { body }) => {
    const { rows } = await pool.query(
        `UPDATE community.comments
        SET body = COALESCE($1, body),
            updated_at = NOW()
        WHERE id = $2 AND is_deleted = false
        RETURNING *`,
        [body, id]
    );
    return rows[0];
};

const softDeleteComment = async (id) => {
    const { rows } = await pool.query(
        'UPDATE community.comments SET is_deleted = true, deleted_at = NOW() WHERE id = $1 RETURNING *',
        [id]
    );
    return rows[0];
};

// --- Post Vote Functions ---
const addPostVote = async ({ post_id, user_id, value }) => {
    const { rows } = await pool.query(
        `INSERT INTO community.post_votes (post_id, user_id, value)
        VALUES ($1, $2, $3)
        ON CONFLICT (post_id, user_id) DO UPDATE SET value = EXCLUDED.value, created_at = NOW()
        RETURNING *`,
        [post_id, user_id, value]
    );
    return rows[0];
};

const removePostVote = async (post_id, user_id) => {
    const result = await pool.query(
        'DELETE FROM community.post_votes WHERE post_id = $1 AND user_id = $2',
        [post_id, user_id]
    );
    return result.rowCount;
};

// No direct updatePostVote is needed as addPostVote handles ON CONFLICT for updates

module.exports = {
    createSpace,
    getSpaceById,
    getSpaceBySlug,
    updateSpace,
    softDeleteSpace,
    createPost,
    getPostById,
    getPostsBySpace,
    updatePost,
    softDeletePost,
    createComment,
    getCommentById,
    getCommentsByPost,
    updateComment,
    softDeleteComment,
    addPostVote,
    removePostVote,
};