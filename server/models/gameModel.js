const pool = require('../config/db');
const {version} = require("uuid");

const createGame = async ({title, description, slug, game_status, realease_date, cover_image_url, metadata, tags_cache, created_by }) => {
    const result = await pool.query(
        `INSERT INTO game_catalog.games (title, slug, description, status, realease_date, cover_image_url, metadata, tags_cache, created_by) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *`,
        [title, slug, description, game_status, release_date, cover_image_url, metadata, tags_cache, created_by]
    );

    return result.rows[0];
}

const createVersion = async ({game_id, version_name, changelog, version_status}) => {
    const result = await pool.query(
        `INSERT INTO game_catalog.game_versions (game_id, version_name, changelog, status)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [game_id, version_name, changelog, version_status]
    );

    return result.rows[0];
}