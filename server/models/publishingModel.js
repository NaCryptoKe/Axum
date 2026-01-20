const pool = require('../config/db');

const createArticle = async ({
    author_id,
    org_id,
    game_id,
    title,
    slug,
    summary,
    body,
    cover_image_url,
    category_id,
    is_published = false,
    published_at,
    is_pinned = false
}) => {
    const { rows } = await pool.query(
        `INSERT INTO publishing.articles
        (author_id, org_id, game_id, title, slug, summary, body, cover_image_url, category_id, is_published, published_at, is_pinned)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *`,
        [author_id, org_id, game_id, title, slug, summary, body, cover_image_url, category_id, is_published, published_at, is_pinned]
    );
    return rows[0];
};

const getArticleById = async (id) => {
    const { rows } = await pool.query(
        'SELECT * FROM publishing.articles WHERE id = $1',
        [id]
    );
    return rows[0];
};

const getArticlesByOrg = async (org_id) => {
    const { rows } = await pool.query(
        'SELECT * FROM publishing.articles WHERE org_id = $1 ORDER BY created_at DESC',
        [org_id]
    );
    return rows;
};

const getArticlesByGame = async (game_id) => {
    const { rows } = await pool.query(
        'SELECT * FROM publishing.articles WHERE game_id = $1 ORDER BY created_at DESC',
        [game_id]
    );
    return rows;
};

const updateArticle = async (id, updates) => {
    const {
        title,
        slug,
        summary,
        body,
        cover_image_url,
        category_id,
        is_published,
        published_at,
        is_pinned
    } = updates;
    const { rows } = await pool.query(
        `UPDATE publishing.articles
        SET
            title = COALESCE($1, title),
            slug = COALESCE($2, slug),
            summary = COALESCE($3, summary),
            body = COALESCE($4, body),
            cover_image_url = COALESCE($5, cover_image_url),
            category_id = COALESCE($6, category_id),
            is_published = COALESCE($7, is_published),
            published_at = COALESCE($8, published_at),
            is_pinned = COALESCE($9, is_pinned),
            updated_at = NOW()
        WHERE id = $10
        RETURNING *`,
        [title, slug, summary, body, cover_image_url, category_id, is_published, published_at, is_pinned, id]
    );
    return rows[0];
};

const deleteArticle = async (id) => {
    const result = await pool.query(
        'DELETE FROM publishing.articles WHERE id = $1',
        [id]
    );
    return result.rowCount;
};


const createCategory = async ({ name, slug }) => {
    const { rows } = await pool.query(
        'INSERT INTO publishing.categories (name, slug) VALUES ($1, $2) RETURNING *',
        [name, slug]
    );
    return rows[0];
};

const getAllCategories = async () => {
    const { rows } = await pool.query(
        'SELECT * FROM publishing.categories ORDER BY name ASC'
    );
    return rows;
};

module.exports = {
    createArticle,
    getArticleById,
    getArticlesByOrg,
    getArticlesByGame,
    updateArticle,
    deleteArticle,
    createCategory,
    getAllCategories
};