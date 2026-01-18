const pool = require('../config/db');

const createGame = async ({
    org_id,
    title,
    slug,
    description,
    status = 'draft',
    release_date,
    cover_image_url,
    metadata,
    created_by
}) => {
    const { rows } = await pool.query(
        `INSERT INTO game_catalog.games
        (   
            org_id, 
            title, 
            slug, 
            description, 
            status, 
            release_date, 
            cover_image_url, 
            metadata, 
            created_by, 
            updated_by 
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $9)
        RETURNING *`,
        [org_id, title, slug, description, status, release_date, cover_image_url, metadata, created_by]
    );
    return rows[0];
};

const getGameById = async (id) => {
    const { rows } = await pool.query(
        'SELECT * FROM game_catalog.games WHERE id = $1 AND is_deleted = false',
        [id]
    );
    return rows[0];
};

const getGameBySlug = async (org_id, slug) => {
    const { rows } = await pool.query(
        'SELECT * FROM game_catalog.games WHERE org_id = $1 AND slug = $2 AND is_deleted = false',
        [org_id, slug]
    );
    return rows[0];
};

const getGamesByOrg = async (org_id) => {
    const { rows } = await pool.query(
        'SELECT * FROM game_catalog.games WHERE org_id = $1 AND is_deleted = false ORDER BY created_at DESC',
        [org_id]
    );
    return rows;
};

const updateGame = async (id, updates) => {
    const { 
        title, 
        slug, 
        description, 
        status, 
        release_date, 
        cover_image_url, 
        metadata, 
        updated_by 
    } = updates;
    const { rows } = await pool.query(
        `UPDATE game_catalog.games
        SET
            title = COALESCE($1, title),
            slug = COALESCE($2, slug),
            description = COALESCE($3, description),
            status = COALESCE($4, status),
            release_date = COALESCE($5, release_date),
            cover_image_url = COALESCE($6, cover_image_url),
            metadata = COALESCE($7, metadata),
            updated_by = $8,
            updated_at = NOW()
        WHERE id = $9 AND is_deleted = false
        RETURNING *`,
        [title, slug, description, status, release_date, cover_image_url, metadata, updated_by, id]
    );
    return rows[0];
};

const softDeleteGame = async (id) => {
    const { rows } = await pool.query(
        'UPDATE game_catalog.games SET is_deleted = true, deleted_at = NOW() WHERE id = $1 RETURNING *',
        [id]
    );
    return rows[0];
};

const createGameVersion = async ({ game_id, version_name, changelog, status = 'draft' }) => {
    const { rows } = await pool.query(
        'INSERT INTO game_catalog.game_versions (game_id, version_name, changelog, status) VALUES ($1, $2, $3, $4) RETURNING *',
        [game_id, version_name, changelog, status]
    );
    return rows[0];
};

const getGameVersions = async (game_id) => {
    const { rows } = await pool.query(
        'SELECT * FROM game_catalog.game_versions WHERE game_id = $1 ORDER BY created_at DESC',
        [game_id]
    );
    return rows;
};

const getGameVersionById = async (id) => {
    const { rows } = await pool.query(
        'SELECT * FROM game_catalog.game_versions WHERE id = $1',
        [id]
    );
    return rows[0];
};

const updateGameVersion = async (id, { version_name, changelog, status }) => {
    const { rows } = await pool.query(
        `UPDATE game_catalog.game_versions
        SET
            version_name = COALESCE($1, version_name),
            changelog = COALESCE($2, changelog),
            status = COALESCE($3, status)
        WHERE id = $4
        RETURNING *`,
        [version_name, changelog, status, id]
    );
    return rows[0];
};

const createGameAsset = async ({ version_id, asset_type, storage_path, file_name, file_size_bytes, checksum }) => {
    const { rows } = await pool.query(
        'INSERT INTO game_catalog.game_assets (version_id, asset_type, storage_path, file_name, file_size_bytes, checksum) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [version_id, asset_type, storage_path, file_name, file_size_bytes, checksum]
    );
    return rows[0];
};

const getAssetsByVersion = async (version_id) => {
    const { rows } = await pool.query(
        'SELECT * FROM game_catalog.game_assets WHERE version_id = $1',
        [version_id]
    );
    return rows;
};

const deleteGameAsset = async (id) => {
    const result = await pool.query(
        'DELETE FROM game_catalog.game_assets WHERE id = $1',
        [id]
    );
    return result.rowCount;
};

const createTag = async ({ name, description, is_mood_tag = false }) => {
    const { rows } = await pool.query(
        'INSERT INTO game_catalog.tags (name, description, is_mood_tag) VALUES ($1, $2, $3) ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description RETURNING *',
        [name, description, is_mood_tag]
    );
    return rows[0];
};

const getAllTags = async () => {
    const { rows } = await pool.query(
        'SELECT * FROM game_catalog.tags ORDER BY name ASC'
    );
    return rows;
};

const getTagsByGame = async (game_id) => {
    const { rows } = await pool.query(
        `SELECT t.* FROM game_catalog.tags t
        JOIN game_catalog.game_tags gt ON t.id = gt.tag_id
        WHERE gt.game_id = $1`,
        [game_id]
    );
    return rows;
};

const addTagToGame = async (game_id, tag_id) => {
    const { rows } = await pool.query(
        'INSERT INTO game_catalog.game_tags (game_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
        [game_id, tag_id]
    );
    return rows[0];
};

const removeTagFromGame = async (game_id, tag_id) => {
    const result = await pool.query(
        'DELETE FROM game_catalog.game_tags WHERE game_id = $1 AND tag_id = $2',
        [game_id, tag_id]
    );
    return result.rowCount;
};

const createGameReview = async ({ game_id, user_id, rating, title, body }) => {
    const { rows } = await pool.query(
        `INSERT INTO game_catalog.game_reviews (game_id, user_id, rating, title, body)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [game_id, user_id, rating, title, body]
    );
    return rows[0];
};

const getGameReviews = async (game_id) => {
    const { rows } = await pool.query(
        'SELECT * FROM game_catalog.game_reviews WHERE game_id = $1 AND is_deleted = false ORDER BY created_at DESC',
        [game_id]
    );
    return rows;
};

const getReviewById = async (id) => {
    const { rows } = await pool.query(
        'SELECT * FROM game_catalog.game_reviews WHERE id = $1 AND is_deleted = false',
        [id]
    );
    return rows[0];
};

const updateGameReview = async (id, { rating, title, body }) => {
    const { rows } = await pool.query(
        `UPDATE game_catalog.game_reviews
        SET
            rating = COALESCE($1, rating),
            title = COALESCE($2, title),
            body = COALESCE($3, body),
            updated_at = NOW()
        WHERE id = $4
        RETURNING *`,
        [rating, title, body, id]
    );
    return rows[0];
};

const softDeleteGameReview = async (id) => {
    const { rows } = await pool.query(
        'UPDATE game_catalog.game_reviews SET is_deleted = true, deleted_at = NOW() WHERE id = $1 RETURNING *',
        [id]
    );
    return rows[0];
};

module.exports = {
    createGame,
    getGameById,
    getGameBySlug,
    getGamesByOrg,
    updateGame,
    softDeleteGame,
    createGameVersion,
    getGameVersions,
    getGameVersionById,
    updateGameVersion,
    createGameAsset,
    getAssetsByVersion,
    deleteGameAsset,
    createTag,
    getAllTags,
    getTagsByGame,
    addTagToGame,
    removeTagFromGame,
    createGameReview,
    getGameReviews,
    getReviewById,
    updateGameReview,
    softDeleteGameReview
};
