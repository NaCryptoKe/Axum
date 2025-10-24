const db = require('../config/db');

/**
 * GAME ASSET MODEL — Tracks assets/files associated with game versions.
 */

/**
 * Add an asset to a game version.
 *
 * @param {Object} params
 * @param {string} params.version_id - UUID of the version.
 * @param {'build_windows'|'build_linux'|'build_mac'|'screenshot'|'video'|'soundtrack'|'documentation'|'other'} params.asset_type
 * @param {string} params.storage_path - Path or URL to the asset.
 * @param {string} [params.file_name]
 * @param {number} [params.file_size_bytes]
 * @param {string} [params.checksum] - SHA256 or similar.
 * @returns {Promise<Object>} Newly created game asset record.
 */
exports.addGameAsset = async ({ version_id, asset_type, storage_path, file_name, file_size_bytes, checksum }) => {
  const result = await db.query(`
    INSERT INTO game_catalog.game_assets
      (version_id, asset_type, storage_path, file_name, file_size_bytes, checksum)
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING *
  `, [version_id, asset_type, storage_path, file_name, file_size_bytes, checksum]);

  return result.rows[0];
};

/**
 * Get all assets for a game version.
 *
 * @param {string} version_id - Version UUID.
 * @returns {Promise<Array<Object>>} Array of assets.
 */
exports.getAssetsByVersion = async (version_id) => {
  const result = await db.query(`
    SELECT * FROM game_catalog.game_assets WHERE version_id = $1 ORDER BY created_at ASC
  `, [version_id]);

  return result.rows;
};
