const pool = require('../config/db');

// ==== Create Organization ====
const createOrganization = async ({
                                      owner_id,
                                      name,
                                      slug,
                                      description = null,
                                      website_url = null
                                  }) => {
    let generatedSlug = slug;

    try {
        const result = await pool.query(
            `INSERT INTO core.organizations (
                owner_id,
                name,
                slug,
                description,
                website_url
            )
             VALUES ($1, $2, $3, $4, $5)
                 RETURNING id, owner_id, name, slug, description, website_url, created_at`,
            [owner_id, name, generatedSlug, description, website_url]
        );

        return result.rows[0];
    } catch (err) {
        if (err.code === '23505') { // unique_violation for slug
            generatedSlug += `-${Math.floor(Math.random() * 10000)}`;

            const retry = await pool.query(
                `INSERT INTO core.organizations (
                    owner_id,
                    name,
                    slug,
                    description,
                    website_url
                )
                 VALUES ($1, $2, $3, $4, $5)
                     RETURNING id, owner_id, name, slug, description, website_url, created_at`,
                [owner_id, name, generatedSlug, description, website_url]
            );

            return retry.rows[0];
        }

        throw err;
    }
};

// ==== Update Organization ====
const updateOrganization = async (id, owner_id, updates) => {
    const { name, slug, description, website_url } = updates;

    const result = await pool.query(
        `UPDATE core.organizations
         SET
             name = COALESCE($1, name),
             slug = $2,
             description = COALESCE($3, description),
             website_url = COALESCE($4, website_url),
             updated_at = now()
         WHERE id = $5 AND owner_id = $6 AND is_deleted = false
             RETURNING id, owner_id, name, slug, description, website_url, is_verified_developer, created_at, updated_at;`,
        [name, slug, description, website_url, id, owner_id]
    );

    return result.rows[0];
};

// ==== Soft Delete Organization ====
const softDeleteOrganization = async (id, owner_id) => {
    const result = await pool.query(
        `UPDATE core.organizations
         SET
             is_deleted = true,
             deleted_at = now(),
             updated_at = now()
         WHERE id = $1 AND owner_id = $2
             RETURNING id, owner_id, name, slug, description, website_url, is_deleted, deleted_at, created_at, updated_at;`,
        [id, owner_id]
    );

    return result.rows[0];
};

// ==== Verify Organization ====
const verifyOrganization = async (id, owner_id) => {
    const result = await pool.query(
        `UPDATE core.organizations
         SET
             is_verified_developer = true,
             updated_at = now()
         WHERE id = $1 AND owner_id = $2 AND is_deleted = false
             RETURNING id, owner_id, name, slug, description, website_url, is_verified_developer, updated_at;`,
        [id, owner_id]
    );

    return result.rows[0];
}


// ==== Get Organization By ID ====
const getOrganizationById = async (id) => {
    const result = await pool.query(
        `SELECT id, owner_id, name, slug, description, website_url, is_verified_developer, is_deleted, created_at, updated_at
         FROM core.organizations
         WHERE id = $1 AND is_deleted = false`,
        [id]
    );

    return result.rows[0];
};

// ==== Get Organization By Slug ====
const getOrganizationBySlug = async (slug) => {
    const result = await pool.query(
        `SELECT id, owner_id, name, slug, description, website_url, is_verified_developer, is_deleted, created_at, updated_at
         FROM core.organizations
         WHERE slug = $1 AND is_deleted = false`,
        [slug]
    );

    return result.rows[0];
};

// ==== Get User Organizations ====
const getUserOrganizations = async (userId) => {
    const result = await pool.query(
        `SELECT o.id, o.name, o.slug
         FROM core.organizations o
         JOIN community.organization_members om ON o.id = om.org_id
         WHERE om.user_id = $1 AND o.is_deleted = false`,
        [userId]
    );
    return result.rows;
};


// ==== Exports ====
module.exports = {
    createOrganization,
    updateOrganization,
    softDeleteOrganization,
    getOrganizationById,
    verifyOrganization,
    getOrganizationBySlug,
    getUserOrganizations
};
