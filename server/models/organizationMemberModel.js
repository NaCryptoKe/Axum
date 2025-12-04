const pool = require('../config/db');

// ==== Add member to organization ====
const addMember = async ({ org_id, user_id, role = 'member' }) => {
    const result = await pool.query(
        `INSERT INTO core.organization_members (org_id, user_id, role)
         VALUES ($1, $2, $3)
         RETURNING org_id, user_id, role, joined_at`,
        [org_id, user_id, role]
    );
    return result.rows[0];
};

const getUserOrganizations = async (user_id) => {
    const result = await pool.query(
        `SELECT 
            o.*,
            m.role AS member_role,
            m.joined_at
        FROM core.organizations o
        JOIN core.organization_members m ON o.id = m.org_id
        WHERE m.user_id = $1
          AND o.is_deleted = false`,
        [user_id]
    );

    return result.rows;
};

// ==== Update member role ====
const updateMemberRole = async (org_id, user_id, role) => {
    const result = await pool.query(
        `UPDATE core.organization_members
         SET role = $1
         WHERE org_id = $2 AND user_id = $3
         RETURNING org_id, user_id, role, joined_at`,
        [role, org_id, user_id]
    );
    return result.rows[0];
};

// ==== Get member info ====
const getMember = async (org_id, user_id) => {
    const result = await pool.query(
        `SELECT org_id, user_id, role, joined_at
         FROM core.organization_members
         WHERE org_id = $1 AND user_id = $2`,
        [org_id, user_id]
    );
    return result.rows[0];
};

// ==== Get all members of an organization ====
const getAllMembers = async (org_id) => {
    const result = await pool.query(
        `SELECT org_id, user_id, role, joined_at
         FROM core.organization_members
         WHERE org_id = $1`,
        [org_id]
    );
    return result.rows;
};

module.exports = {
    addMember,
    updateMemberRole,
    getMember,
    getAllMembers,
    getUserOrganizations
};
