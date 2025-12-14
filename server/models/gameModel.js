const pool = require('../config/db');

/* =====================================================
   GAMES
===================================================== */

const createGame = async ({
    org_id,
    title,
    slug,
    description,
    status = 'draft',
    release_date,
    cover_image_url,
    metadata,
    tags_cache,
    created_by
}) => {
    const { rows } = await pool.query(
        `INSERT INTO game_catalog.games
        (org_id, title, slug, description, status, release_date, cover_image_url, metadata, tags_cache, created_by)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        RETURNING *`,
        [
            org_id,
            title,
            slug,
            description,
            status,
            release_date,
            cover_image_url,
            metadata,
            tags_cache,
            created_by
        ]
    );

    return rows[0];
};

const getGameById = async (id) => {
    const { rows } = await pool.query(
        `SELECT * FROM game_catalog.games
         WHERE id = $1 AND is_deleted = false`,
        [id]
    );

    return rows[0];
};

const getGameByTitle = async (title) => {
    const { rows } = await pool.query(
        `SELECT * FROM game_catalog.games
         WHERE title = $1 AND is_deleted = false`,
        [title]
    );

    return rows[0];
};

const updateGame = async ({
    id,
    title,
    description,
    status,
    release_date,
    cover_image_url,
    metadata,
    tags_cache,
    updated_by
}) => {
    const { rows } = await pool.query(
        `UPDATE game_catalog.games
         SET title = $1,
             description = $2,
             status = $3,
             release_date = $4,
             cover_image_url = $5,
             metadata = $6,
             tags_cache = $7,
             updated_by = $8,
             updated_at = NOW()
         WHERE id = $9
         RETURNING *`,
        [
            title,
            description,
            status,
            release_date,
            cover_image_url,
            metadata,
            tags_cache,
            updated_by,
            id
        ]
    );

    return rows[0];
};

const softDeleteGame = async (id) => {
    const { rows } = await pool.query(
        `UPDATE game_catalog.games
         SET is_deleted = true,
             deleted_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [id]
    );

    return rows[0];
};

/* =====================================================
   GAME VERSIONS
===================================================== */

const createVersion = async ({
    game_id,
    version_name,
    changelog,
    status = 'draft'
}) => {
    const { rows } = await pool.query(
        `INSERT INTO game_catalog.game_versions
        (game_id, version_name, changelog, status)
        VALUES ($1,$2,$3,$4)
        RETURNING *`,
        [game_id, version_name, changelog, status]
    );

    return rows[0];
};

const getGameVersions = async (game_id) => {
    const { rows } = await pool.query(
        `SELECT * FROM game_catalog.game_versions
         WHERE game_id = $1
         ORDER BY created_at DESC`,
        [game_id]
    );

    return rows;
};

const updateVersion = async ({
    id,
    version_name,
    changelog,
    status
}) => {
    const { rows } = await pool.query(
        `UPDATE game_catalog.game_versions
         SET version_name = $1,
             changelog = $2,
             status = $3,
             updated_at = NOW()
         WHERE id = $4
         RETURNING *`,
        [version_name, changelog, status, id]
    );

    return rows[0];
};

const deleteGameVersion = async (game_id, version_id) => {
    const result = await pool.query(
        `DELETE FROM game_catalog.game_versions
         WHERE id = $1 AND game_id = $2`,
        [version_id, game_id]
    );

    return result.rowCount;
};

const deleteAllVersions = async (game_id) => {
    const result = await pool.query(
        `DELETE FROM game_catalog.game_versions
         WHERE game_id = $1`,
        [game_id]
    );

    return result.rowCount;
};

/* =====================================================
   GAME ASSETS
===================================================== */

const createAsset = async ({
    version_id,
    asset_type,
    storage_path,
    file_name,
    file_size_bytes,
    checksum
}) => {
    const { rows } = await pool.query(
        `INSERT INTO game_catalog.game_assets
        (version_id, asset_type, storage_path, file_name, file_size_bytes, checksum)
        VALUES ($1,$2,$3,$4,$5,$6)
        RETURNING *`,
        [
            version_id,
            asset_type,
            storage_path,
            file_name,
            file_size_bytes,
            checksum
        ]
    );

    return rows[0];
};

const getAssetsByVersion = async (version_id) => {
    const { rows } = await pool.query(
        `SELECT * FROM game_catalog.game_assets
         WHERE version_id = $1`,
        [version_id]
    );

    return rows;
};

const deleteAsset = async (asset_id) => {
    const result = await pool.query(
        `DELETE FROM game_catalog.game_assets
         WHERE id = $1`,
        [asset_id]
    );

    return result.rowCount;
};

/* =====================================================
   TAGS
===================================================== */

const createTag = async ({ name, description, mood_tag = false }) => {
    const { rows } = await pool.query(
        `INSERT INTO game_catalog.tags
        (name, description, is_mood_tag)
        VALUES ($1,$2,$3)
        RETURNING *`,
        [name, description, mood_tag]
    );

    return rows[0];
};

const updateTag = async ({ id, name, description, mood_tag = false }) => {
    const { rows } = await pool.query(
        `UPDATE game_catalog.tags
         SET name = $1,
             description = $2,
             is_mood_tag = $3
         WHERE id = $4
         RETURNING *`,
        [name, description, mood_tag, id]
    );

    return rows[0];
};

const deleteTag = async (id) => {
    const result = await pool.query(
        `DELETE FROM game_catalog.tags
         WHERE id = $1`,
        [id]
    );

    return result.rowCount;
};

const addTagToGame = async ({ game_id, tag_id }) => {
    const { rows } = await pool.query(
        `INSERT INTO game_catalog.game_tags
        (game_id, tag_id)
        VALUES ($1,$2)
        RETURNING *`,
        [game_id, tag_id]
    );

    return rows[0];
};

const removeTagFromGame = async ({ game_id, tag_id }) => {
    const result = await pool.query(
        `DELETE FROM game_catalog.game_tags
         WHERE game_id = $1 AND tag_id = $2`,
        [game_id, tag_id]
    );

    return result.rowCount;
};

/* =====================================================
   REVIEWS
===================================================== */

const createReview = async ({
    game_id,
    user_id,
    rating,
    title,
    body
}) => {
    const { rows } = await pool.query(
        `INSERT INTO game_catalog.game_reviews
        (game_id, user_id, rating, title, body, created_at)
        VALUES ($1,$2,$3,$4,$5,NOW())
        RETURNING *`,
        [game_id, user_id, rating, title, body]
    );

    return rows[0];
};

const updateReview = async ({ id, rating, title, body }) => {
    const { rows } = await pool.query(
        `UPDATE game_catalog.game_reviews
         SET rating = $1,
             title = $2,
             body = $3
         WHERE id = $4
         RETURNING *`,
        [rating, title, body, id]
    );

    return rows[0];
};

/* =====================================================
   EXPORTS
===================================================== */

module.exports = {
    // Games
    createGame,
    getGameById,
    getGameByTitle,
    updateGame,
    softDeleteGame,

    // Versions
    createVersion,
    getGameVersions,
    updateVersion,
    deleteGameVersion,
    deleteAllVersions,

    // Assets
    createAsset,
    getAssetsByVersion,
    deleteAsset,

    // Tags
    createTag,
    updateTag,
    deleteTag,
    addTagToGame,
    removeTagFromGame,

    // Reviews
    createReview,
    updateReview
};
