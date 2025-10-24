const db = require('../config/db');

/**
 * ===============================================
 *  ORGANIZATION MEMBER MODEL — Membership & roles
 * ===============================================
 *
 * Represents members of organizations and their roles.
 * Each record links a `user_id` to an `org_id` with a role.
 * Deleting a user or organization cascades the membership entry.
 *
 * Roles are defined in the `core.org_member_role` enum:
 * 'member', 'developer', 'finance', 'admin', 'owner'.
 */

// =========================== CRUD OPERATIONS ===============================

/**
 * Add a member to an organization.
 *
 * @param {Object} params - Membership data.
 * @param {string} params.org_id - UUID of the organization.
 * @param {string} params.user_id - UUID of the user to add.
 * @param {'member'|'developer'|'finance'|'admin'|'owner'} [params.role='member'] - Role to assign.
 *
 * @returns {Promise<Object>} The newly created membership record.
 *
 * @example
 * const member = await addOrganizationMember({
 *   org_id: 'f9d3c2b1-...',
 *   user_id: 'b4f9c8d2-...',
 *   role: 'developer'
 * });
 */
exports.addOrganizationMember = async ({ org_id, user_id, role = 'member' }) => {
  const result = await db.query(`
    INSERT INTO core.organization_members (org_id, user_id, role)
    VALUES ($1, $2, $3)
    RETURNING org_id, user_id, role, joined_at
  `, [org_id, user_id, role]);

  return result.rows[0];
};


/**
 * Get all members of an organization.
 *
 * @param {string} org_id - UUID of the organization.
 * @returns {Promise<Array<Object>>} List of members with their roles.
 *
 * @example
 * const members = await getOrganizationMembers('f9d3c2b1-...');
 */
exports.getOrganizationMembers = async (org_id) => {
  const result = await db.query(`
    SELECT om.org_id, om.user_id, om.role, om.joined_at,
           u.username, u.display_name, u.avatar_url
    FROM core.organization_members om
    JOIN core.users u ON om.user_id = u.id
    WHERE om.org_id = $1
    ORDER BY om.joined_at ASC
  `, [org_id]);

  return result.rows;
};


/**
 * Update a member's role in an organization.
 *
 * @param {string} org_id - UUID of the organization.
 * @param {string} user_id - UUID of the member.
 * @param {'member'|'developer'|'finance'|'admin'|'owner'} role - New role.
 *
 * @returns {Promise<Object|null>} Updated membership record or null if not found.
 *
 * @example
 * const updated = await updateMemberRole('org-id', 'user-id', 'admin');
 */
exports.updateMemberRole = async (org_id, user_id, role) => {
  const result = await db.query(`
    UPDATE core.organization_members
    SET role = $3
    WHERE org_id = $1 AND user_id = $2
    RETURNING org_id, user_id, role, joined_at
  `, [org_id, user_id, role]);

  return result.rows[0] || null;
};


/**
 * Remove a member from an organization.
 *
 * @param {string} org_id - UUID of the organization.
 * @param {string} user_id - UUID of the member.
 *
 * @returns {Promise<Object|null>} Deleted membership record or null if not found.
 *
 * @example
 * const removed = await removeOrganizationMember('org-id', 'user-id');
 */
exports.removeOrganizationMember = async (org_id, user_id) => {
  const result = await db.query(`
    DELETE FROM core.organization_members
    WHERE org_id = $1 AND user_id = $2
    RETURNING org_id, user_id, role
  `, [org_id, user_id]);

  return result.rows[0] || null;
};


/**
 * Get a specific member of an organization.
 *
 * @param {string} org_id - UUID of the organization.
 * @param {string} user_id - UUID of the member.
 * @returns {Promise<Object|null>} Membership record or null if not found.
 *
 * @example
 * const member = await getOrganizationMember('org-id', 'user-id');
 */
exports.getOrganizationMember = async (org_id, user_id) => {
  const result = await db.query(`
    SELECT org_id, user_id, role, joined_at
    FROM core.organization_members
    WHERE org_id = $1 AND user_id = $2
  `, [org_id, user_id]);

  return result.rows[0] || null;
};
