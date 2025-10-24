const db = require('../config/db');

/**
 * ===============================================
 *  GAME MODEL — Game entity
 * ===============================================
 *
 * Represents a game within an organization.
 * Tracks metadata, status, ratings, tags, soft deletion, and audit info.
 */

/**
 * Create a new game.
 *
 * @param {Object} params
 * @param {string} params.org_id - UUID of the organization that owns the game.
 * @param {string} params.title - Game title.
 * @param {string} params.slug - URL-friendly slug for the game (unique per org).
 * @param {string} [params.description] - Optional description.
 * @param {Date|string} [params.release_date] - Optional release date.
 * @param {string} [params.cover_image_url] - Optional cover image URL.
 * @param {Object} [params.metadata] - Optional JSON metadata.
 * @param {string} [params.created_by] - UUID of the user who created the game.
 *
 * @returns {Promise<Object>} Newly created game record.
 */
exports.createGame = async ({ org_id, title, slug, description, release_date, cover_image_url, metadata, created_by }) => {
  const result = await db.query(`
    INSERT INTO game_catalog.games 
      (org_id, title, slug, description, release_date, cover_image_url, metadata, created_by)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *
  `, [org_id, title, slug, description, release_date, cover_image_url, metadata, created_by]);

  return result.rows[0];
};

/**
 * Get a game by its ID.
 *
 * @param {string} id - Game UUID.
 * @returns {Promise<Object|null>} Game record or null if not found.
 */
exports.getGameById = async (id) => {
  const result = await db.query(`SELECT * FROM game_catalog.games WHERE id = $1`, [id]);
  return result.rows[0] || null;
};

/**
 * Update a game (partial update).
 *
 * @param {string} id - Game UUID.
 * @param {Object} updates - Fields to update.
 * @param {string} [updates.title]
 * @param {string} [updates.slug]
 * @param {string} [updates.description]
 * @param {Date|string} [updates.release_date]
 * @param {string} [updates.cover_image_url]
 * @param {Object} [updates.metadata]
 * @param {'draft'|'upcoming'|'published'|'archived'} [updates.status]
 * @param {string} [updates.updated_by] - UUID of the updater.
 * @returns {Promise<Object|null>} Updated game record or null.
 */
exports.updateGame = async (id, updates) => {
  const { title, slug, description, release_date, cover_image_url, metadata, status, updated_by } = updates;
  const result = await db.query(`
    UPDATE game_catalog.games
    SET 
      title = COALESCE($1, title),
      slug = COALESCE($2, slug),
      description = COALESCE($3, description),
      release_date = COALESCE($4, release_date),
      cover_image_url = COALESCE($5, cover_image_url),
      metadata = COALESCE($6, metadata),
      status = COALESCE($7, status),
      updated_by = $8,
      updated_at = now()
    WHERE id = $9
    RETURNING *
  `, [title, slug, description, release_date, cover_image_url, metadata, status, updated_by, id]);

  return result.rows[0] || null;
};

/**
 * Soft delete a game.
 *
 * @param {string} id - Game UUID.
 * @returns {Promise<Object|null>} Soft-deleted game record or null if not found.
 */
exports.softDeleteGame = async (id) => {
  const result = await db.query(`
    UPDATE game_catalog.games
    SET is_deleted = true, deleted_at = now()
    WHERE id = $1
    RETURNING *
  `, [id]);
  return result.rows[0] || null;
};
