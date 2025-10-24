const db = require('../config/db');

/**
 * ===============================================
 *  ORGANIZATION MODEL — Handles developer organizations
 * ===============================================
 *
 * Represents organizations in Axum Arcade, linked to an owner (`user_id`).
 * Soft-deletes are supported (`is_deleted`), allowing historical record keeping.
 * Verified developer status can be toggled via `is_verified_developer`.
 */

// =========================== CRUD OPERATIONS ===============================

/**
 * Create a new organization.
 *
 * @description
 * Inserts a new organization into `core.organizations`.  
 * The `owner_id` must reference an existing user.  
 * Slug must be unique and only contain lowercase letters, numbers, and dashes.
 *
 * @param {Object} params - Organization data.
 * @param {string} params.owner_id - UUID of the organization owner.
 * @param {string} params.name - Organization name.
 * @param {string} params.slug - URL-friendly unique slug.
 * @param {string} [params.description] - Optional description.
 * @param {string} [params.website_url] - Optional website URL.
 *
 * @returns {Promise<Object>} The newly created organization.
 *
 * @example
 * const org = await createOrganization({
 *   owner_id: 'b4f9c8d2-1234-45ef-9d87-2f08bda8fa2a',
 *   name: 'Pixel Masters',
 *   slug: 'pixel-masters',
 *   description: 'We make indie games',
 *   website_url: 'https://pixelmasters.com'
 * });
 */
exports.createOrganization = async ({ owner_id, name, slug, description, website_url }) => {
  const result = await db.query(`
    INSERT INTO core.organizations (owner_id, name, slug, description, website_url)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, owner_id, name, slug, description, website_url, is_verified_developer, created_at, updated_at
  `, [owner_id, name, slug, description, website_url]);

  return result.rows[0];
};


/**
 * Get an organization by its ID (excluding deleted).
 *
 * @param {string} id - UUID of the organization.
 * @returns {Promise<Object|null>} Organization record or null if not found or deleted.
 *
 * @example
 * const org = await getOrganizationById('f9d3c2b1-...');
 */
exports.getOrganizationById = async (id) => {
  const result = await db.query(`
    SELECT id, owner_id, name, slug, description, website_url, is_verified_developer, created_at, updated_at
    FROM core.organizations
    WHERE id = $1 AND is_deleted = false
  `, [id]);

  return result.rows[0] || null;
};


/**
 * Update an organization's fields (partial update).
 *
 * @param {string} id - UUID of the organization.
 * @param {Object} updates - Fields to update.
 * @param {string} [updates.name] - New name.
 * @param {string} [updates.slug] - New slug.
 * @param {string} [updates.description] - New description.
 * @param {string} [updates.website_url] - New website URL.
 * @param {boolean} [updates.is_verified_developer] - Verified developer flag.
 *
 * @returns {Promise<Object|null>} Updated organization or null if not found/deleted.
 *
 * @example
 * const updatedOrg = await updateOrganization('f9d3c2b1-...', { description: 'Updated description' });
 */
exports.updateOrganization = async (id, updates) => {
  const { name, slug, description, website_url, is_verified_developer } = updates;

  const result = await db.query(`
    UPDATE core.organizations
    SET
      name = COALESCE($1, name),
      slug = COALESCE($2, slug),
      description = COALESCE($3, description),
      website_url = COALESCE($4, website_url),
      is_verified_developer = COALESCE($5, is_verified_developer),
      updated_at = now()
    WHERE id = $6 AND is_deleted = false
    RETURNING id, owner_id, name, slug, description, website_url, is_verified_developer, updated_at
  `, [name, slug, description, website_url, is_verified_developer, id]);

  return result.rows[0] || null;
};


/**
 * Soft delete an organization.
 *
 * @param {string} id - UUID of the organization.
 * @returns {Promise<Object|null>} Soft-deleted organization or null if not found.
 *
 * @example
 * const deletedOrg = await softDeleteOrganization('f9d3c2b1-...');
 */
exports.softDeleteOrganization = async (id) => {
  const result = await db.query(`
    UPDATE core.organizations
    SET is_deleted = true, deleted_at = now(), updated_at = now()
    WHERE id = $1 AND is_deleted = false
    RETURNING id, owner_id, name, slug, deleted_at
  `, [id]);

  return result.rows[0] || null;
};


/**
 * Permanently delete an organization.
 *
 * @param {string} id - UUID of the organization.
 * @returns {Promise<Object|null>} Deleted organization record or null if not found.
 *
 * @example
 * const deletedOrg = await hardDeleteOrganization('f9d3c2b1-...');
 */
exports.hardDeleteOrganization = async (id) => {
  const result = await db.query(`
    DELETE FROM core.organizations
    WHERE id = $1
    RETURNING id, owner_id, name, slug
  `, [id]);

  return result.rows[0] || null;
};
