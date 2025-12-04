const pool = require('../config/db');

// ----------------------------------------------------
// CREATE A GAME
// ----------------------------------------------------
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
    const result = await pool.query(
        `INSERT INTO game_catalog.games 
        (org_id, title, slug, description, status, release_date, cover_image_url, metadata, tags_cache, created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
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

    return result.rows[0];
};


// ----------------------------------------------------
// GET GAME BY ID
// ----------------------------------------------------
const getGameById = async (id) => {
    const result = await pool.query(
        `SELECT * FROM game_catalog.games 
         WHERE id = $1 AND is_deleted = false`,
        [id]
    );
    return result.rows[0];
};


// ----------------------------------------------------
// SOFT DELETE GAME
// ----------------------------------------------------
const softDeleteGame = async (id) => {
    const result = await pool.query(
        `UPDATE game_catalog.games
         SET is_deleted = true,
             deleted_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [id]
    );

    return result.rows[0];
};


// ----------------------------------------------------
// UPDATE GAME (BASIC FIELDS)
// ----------------------------------------------------
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
    const result = await pool.query(
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

    return result.rows[0];
};


// ----------------------------------------------------
// CREATE GAME VERSION
// ----------------------------------------------------
const createVersion = async ({ game_id, version_name, changelog, status = 'draft' }) => {
    const result = await pool.query(
        `INSERT INTO game_catalog.game_versions 
        (game_id, version_name, changelog, status)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [game_id, version_name, changelog, status]
    );

    return result.rows[0];
};


// ----------------------------------------------------
// GET ALL VERSIONS FOR A GAME
// ----------------------------------------------------
const getGameVersions = async (game_id) => {
    const result = await pool.query(
        `SELECT * FROM game_catalog.game_versions
         WHERE game_id = $1
         ORDER BY created_at DESC`,
        [game_id]
    );

    return result.rows;
};


// ----------------------------------------------------
// CREATE GAME ASSET
// ----------------------------------------------------
const createAsset = async ({
                               version_id,
                               asset_type,
                               storage_path,
                               file_name,
                               file_size_bytes,
                               checksum
                           }) => {
    const result = await pool.query(
        `INSERT INTO game_catalog.game_assets
        (version_id, asset_type, storage_path, file_name, file_size_bytes, checksum)
        VALUES ($1, $2, $3, $4, $5, $6)
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

    return result.rows[0];
};


// ----------------------------------------------------
// GET ASSETS FOR VERSION
// ----------------------------------------------------
const getAssetsByVersion = async (version_id) => {
    const result = await pool.query(
        `SELECT * FROM game_catalog.game_assets
         WHERE version_id = $1`,
        [version_id]
    );

    return result.rows;
};

const updateVersion = async ({
                                 id,
                                 version_name,
                                 changelog,
                                 status,
                             }) => {
    const result = await pool.query(
        `UPDATE game_catalog.game_versions
         SET version_name = $1,
             changelog = $2,
             status = $3,
             created_at = created_at, -- keep original
             updated_at = NOW()
         WHERE id = $4
         RETURNING *`,
        [
            version_name,
            changelog,
            status,
            id
        ]
    );

    return result.rows[0];
};

// ----------------------------------------------------
// EXPORT EVERYTHING
// ----------------------------------------------------
module.exports = {
    createGame,
    getGameById,
    updateGame,
    softDeleteGame,
    createVersion,
    getGameVersions,
    createAsset,
    getAssetsByVersion,
    updateVersion
};
