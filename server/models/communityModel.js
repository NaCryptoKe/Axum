const pool = require('../config/db');

// --- Space Functions ---
const createSpace = async ({ creator_id, related_game_id, organization_id, name, slug, description }) => {
    const { rows } = await pool.query(
        `INSERT INTO community.spaces (creator_id, related_game_id, organization_id, name, slug, description)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [creator_id, related_game_id, organization_id, name, slug, description]
    );
    return rows[0];
};

const getSpaceById = async (id, includeDeleted = false) => {
    let query = 'SELECT * FROM community.spaces WHERE id = $1';
    if (!includeDeleted) {
        query += ' AND is_deleted = false';
    }
    const { rows } = await pool.query(query, [id]);
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

const undeleteSpace = async (id) => {
    const { rows } = await pool.query(
        'UPDATE community.spaces SET is_deleted = false, deleted_at = NULL WHERE id = $1 RETURNING *',
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

const getPostById = async (id, includeDeleted = false) => {
    let query = 'SELECT * FROM community.posts WHERE id = $1';
    if (!includeDeleted) {
        query += ' AND is_deleted = false';
    }
    const { rows } = await pool.query(query, [id]);
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

const undeletePost = async (id) => {
    const { rows } = await pool.query(
        'UPDATE community.posts SET is_deleted = false, deleted_at = NULL WHERE id = $1 RETURNING *',
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

const getCommentById = async (id, includeDeleted = false) => {
    let query = 'SELECT * FROM community.comments WHERE id = $1';
    if (!includeDeleted) {
        query += ' AND is_deleted = false';
    }
    const { rows } = await pool.query(query, [id]);
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
        `WITH RECURSIVE comment_tree AS (
            SELECT id FROM community.comments WHERE id = $1
            UNION ALL
            SELECT c.id FROM community.comments c
            INNER JOIN comment_tree ct ON c.parent_comment_id = ct.id
        )
        UPDATE community.comments
        SET is_deleted = true, deleted_at = NOW()
        WHERE id IN (SELECT id FROM comment_tree)
        RETURNING *`,
        [id]
    );
    return rows;
};

const undeleteComment = async (id) => {
    const { rows } = await pool.query(
        'UPDATE community.comments SET is_deleted = false, deleted_at = NULL WHERE id = $1 RETURNING *',
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

// --- Comment Vote Functions ---
const addCommentVote = async ({ comment_id, user_id, value }) => {
    const { rows } = await pool.query(
        `INSERT INTO community.comment_votes (comment_id, user_id, value)
        VALUES ($1, $2, $3)
        ON CONFLICT (comment_id, user_id) DO UPDATE SET value = EXCLUDED.value, created_at = NOW()
        RETURNING *`,
        [comment_id, user_id, value]
    );
    return rows[0];
};

const removeCommentVote = async (comment_id, user_id) => {
    const result = await pool.query(
        'DELETE FROM community.comment_votes WHERE comment_id = $1 AND user_id = $2',
        [comment_id, user_id]
    );
    return result.rowCount;
};


module.exports = {
    createSpace,
    getSpaceById,
    getSpaceBySlug,
    updateSpace,
    softDeleteSpace,
    undeleteSpace,
    createPost,
    getPostById,
    getPostsBySpace,
    updatePost,
    softDeletePost,
    undeletePost,
    createComment,
    getCommentById,
    getCommentsByPost,
    updateComment,
    softDeleteComment,
    undeleteComment,
    addPostVote,
    removePostVote,
    addCommentVote,
    removeCommentVote,
};