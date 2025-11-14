const {
    createOrganization,
    updateOrganization,
    softDeleteOrganization,
    getOrganizationById,
    verifyOrganization,
    getOrganizationBySlug
} = require("../models/organizationModel");

const {
    addMember,
    updateMemberRole,
    getMember,
    getAllMembers
} = require("../models/organizationMemberModel");

const { getUserByUsername } = require("../models/userModel");

// ==== Health Check ====
const healthCheck = (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'Organization router running',
        data: null,
        error: null,
    });
};

// ==== Create Organization ====
const registerOrganization = async (req, res) => {
    const { user } = req;

    if (!user?.valid) {
        return res.status(401).json({
            success: false,
            message: "Not authorized",
            data: null,
            error: {
                code: "UNAUTHORIZED",
                details: "You must be logged in to create a new organization"
            }
        });
    }

    const { name, slug, description, website_url } = req.body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid organization name",
            data: null,
            error: {
                code: "INVALID_INPUT",
                details: "Organization name is required and must be a non-empty string"
            }
        });
    }

    if (!slug || slug.trim().length === 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid organization name",
            data: null,
            error: {
                code: "INVALID_INPUT",
                details: "Organization name is required and must be a non-empty string"
            }
        });
    }

    try {
        const organization = await createOrganization({
            owner_id: user.id,
            name,
            slug,
            description,
            website_url
        });
        const org_id = organization.id;
        const user_id = organization.owner_id;
        const role = 'owner';
        addMember({ org_id, user_id, role });
        return res.status(201).json({
            success: true,
            message: "Organization created successfully",
            data: { organization },
            error: null
        });
    } catch (error) {
        console.error("Error creating organization:", error);

        if (error.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "Organization slug already exists",
                data: null,
                error: {
                    code: "DUPLICATE_SLUG",
                    details: "The provided slug is already in use by another organization"
                }
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null,
            error: {
                code: "INTERNAL_ERROR",
                details: error.message
            }
        });
    }
};

// ==== Update Organization ====
const editOrganization = async (req, res) => {
    const { user } = req;
    const { id } = req.params;
    const { name, slug, description, website_url } = req.body;

    if (!user?.valid) {
        return res.status(401).json({
            success: false,
            message: "Not authorized",
            data: null,
            error: {
                code: "UNAUTHORIZED",
                details: "You must be logged in to update an organization"
            }
        });
    }

    try {
        const organization = await updateOrganization(id, user.id, {
            name,
            slug,
            description,
            website_url
        });

        if (!organization) {
            return res.status(404).json({
                success: false,
                message: "Organization not found or not owned by user",
                data: null,
                error: {
                    code: "NOT_FOUND",
                    details: "No organization found for the provided ID and user"
                }
            });
        }

        return res.status(200).json({
            success: true,
            message: "Organization updated successfully",
            data: { organization },
            error: null
        });
    } catch (err) {
        console.error("Error updating organization:", err);

        if (err.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "Slug already in use",
                data: null,
                error: {
                    code: "DUPLICATE_SLUG",
                    details: "Another organization already uses this slug"
                }
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null,
            error: {
                code: "INTERNAL_ERROR",
                details: err.message
            }
        });
    }
};

// ==== Delete Organization ====
const deleteOrganization = async (req, res) => {
    const { user } = req;
    const { id } = req.params;
    const org = await getOrganizationById(id);

    if (!user?.valid || user?.id !== org?.owner_id) {
        return res.status(401).json({
            success: false,
            message: "Not authorized",
            data: null,
            error: {
                code: "UNAUTHORIZED",
                details: "You must be logged in to delete an organization"
            }
        });
    }

    try {
        const organization = await softDeleteOrganization(id, user.id);

        if (!organization) {
            return res.status(404).json({
                success: false,
                message: "Organization not found or not owned by you",
                data: null,
                error: {
                    code: "NOT_FOUND",
                    details: "No organization found for the provided ID and user"
                }
            });
        }

        return res.status(200).json({
            success: true,
            message: "Organization deleted successfully",
            data: { organization },
            error: null
        });
    } catch (error) {
        console.error("Error deleting organization:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null,
            error: {
                code: "INTERNAL_ERROR",
                details: error.message
            }
        });
    }
};

// ==== Verify Organization ====
const verifyOrganizationController = async (req, res) => {
    const { user } = req;
    const { id } = req.params;

    if (!user?.valid) {
        return res.status(401).json({
            success: false,
            message: "Not authorized",
            data: null,
            error: {
                code: "UNAUTHORIZED",
                details: "You must be logged in to verify an organization"
            }
        });
    }

    const org = await getOrganizationById(id);
    if (!org) {
        return res.status(404).json({
            success: false,
            message: "Organization not found",
            data: null,
            error: {
                code: "NOT_FOUND",
                details: "No organization found with the provided ID"
            }
        });
    }

    if (user.id !== org.owner_id) {
        return res.status(403).json({
            success: false,
            message: "Forbidden",
            data: null,
            error: {
                code: "FORBIDDEN",
                details: "Only the owner can verify this organization"
            }
        });
    }

    try {
        const organization = await verifyOrganization(id, user.id);

        return res.status(200).json({
            success: true,
            message: "Organization verified successfully",
            data: { organization },
            error: null
        });
    } catch (error) {
        console.error("Error verifying organization:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null,
            error: {
                code: "INTERNAL_ERROR",
                details: error.message
            }
        });
    }
};

// ==== Get Organization Info By Slug ====
const getOrganizationBySlugController = async (req, res) => {
    const { user } = req;
    const { slug } = req.params;

    try {
        const org = await getOrganizationBySlug(slug);

        if (!org) {
            return res.status(404).json({
                success: false,
                message: "Organization not found",
                data: null,
                error: {
                    code: "NOT_FOUND",
                    details: "No organization exists with the provided slug"
                }
            });
        }

        // Check ownership
        const isOwner = user?.valid && user.id === org.owner_id;

        // If not owner, only return limited public info
        const responseData = isOwner
            ? org  // full info for owner
            : {
                id: org.id,
                name: org.name,
                slug: org.slug,
                description: org.description,
                website_url: org.website_url,
                is_verified_developer: org.is_verified_developer,
                created_at: org.created_at,
                updated_at: org.updated_at
            };

        return res.status(200).json({
            success: true,
            message: "Organization retrieved successfully",
            data: { organization: responseData },
            error: null
        });

    } catch (error) {
        console.error("Error fetching organization by slug:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null,
            error: {
                code: "INTERNAL_ERROR",
                details: error.message
            }
        });
    }
};

// ==== Add member ====
const addMemberController = async (req, res) => {
    const { user } = req;
    const { slug } = req.params;

    if (!user?.valid) {
        return res.status(401).json({
            success: false,
            message: "Not authorized",
            data: null,
            error: { code: "UNAUTHORIZED", details: "Login required" }
        });
    }
    const org = await getOrganizationBySlug(slug);
    const org_id = org?.id;
    const user_id = user?.id;
    try {
        const member = await addMember({ org_id, user_id });
        return res.status(201).json({
            success: true,
            message: "Member added successfully",
            data: { member },
            error: null
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null,
            error: { code: "INTERNAL_ERROR", details: err.message }
        });
    }
};

// ==== Update member role ====
const updateMemberRoleController = async (req, res) => {
    const { user } = req;
    const { username, role } = req.body;
    const { slug } = req.params;

    // Step 1: Check if logged in
    if (!user?.valid) {
        return res.status(401).json({
            success: false,
            message: "Not authorized",
            data: null,
            error: { code: "UNAUTHORIZED", details: "Login required" }
        });
    }

    // Step 2: Get target user and organization
    const targetUser = await getUserByUsername(username);
    const org = await getOrganizationBySlug(slug);

    if (!targetUser || !org) {
        return res.status(404).json({
            success: false,
            message: "User or organization not found",
            data: null,
            error: { code: "NOT_FOUND", details: "Invalid username or organization slug" }
        });
    }

    const org_id = org.id;
    const target_user_id = targetUser.id;

    // Step 3: Get logged-in user's role in the org
    const currentUserMember = await getMember(org_id, user.id);
    if (!currentUserMember) {
        return res.status(403).json({
            success: false,
            message: "Forbidden",
            data: null,
            error: { code: "FORBIDDEN", details: "You are not a member of this organization" }
        });
    }

    // Step 4: Get target user's role in the org
    const targetMember = await getMember(org_id, target_user_id);
    if (!targetMember) {
        return res.status(404).json({
            success: false,
            message: "Member not found",
            data: null,
            error: { code: "NOT_FOUND", details: "Target user is not a member of this org" }
        });
    }

    const actorRole = currentUserMember.role;
    const targetRole = targetMember.role;

    // Step 5: Prevent self-promotion to owner
    if (target_user_id === user.id && role === 'owner') {
        return res.status(403).json({
            success: false,
            message: "Forbidden",
            data: null,
            error: { code: "FORBIDDEN", details: "You cannot promote yourself to owner" }
        });
    }

    // Step 6: RBAC rules for managing others
    if (target_user_id !== user.id) { // only applies when managing someone else
        if (actorRole === 'owner') {
            if (targetRole === 'owner') {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden",
                    data: null,
                    error: { code: "FORBIDDEN", details: "Owners cannot manage other owners" }
                });
            }
        } else if (actorRole === 'admin') {
            if (['owner', 'admin'].includes(targetRole)) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden",
                    data: null,
                    error: { code: "FORBIDDEN", details: "Admins cannot manage owners or other admins" }
                });
            }
            if (role === 'owner') {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden",
                    data: null,
                    error: { code: "FORBIDDEN", details: "Admins cannot promote anyone to owner" }
                });
            }
        } else {
            return res.status(403).json({
                success: false,
                message: "Forbidden",
                data: null,
                error: { code: "FORBIDDEN", details: "Only admins or owners can manage member roles" }
            });
        }
    }

    // Step 7: Validate new role
    const validRoles = ['member','moderator','developer','finance','admin','owner'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({
            success: false,
            message: "Invalid role",
            data: null,
            error: { code: "INVALID_ROLE", details: "Role must be one of " + validRoles.join(", ") }
        });
    }

    // Step 8: Update role
    try {
        const updatedMember = await updateMemberRole(org_id, target_user_id, role);
        return res.status(200).json({
            success: true,
            message: "Member role updated successfully",
            data: { member: updatedMember },
            error: null
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null,
            error: { code: "INTERNAL_ERROR", details: err.message }
        });
    }
};

// ==== Get single member ====
const getMemberController = async (req, res) => {
    const { slug, username } = req.params;

    const org = await getOrganizationBySlug(slug);
    const user = await getUserByUsername(username);

    if (!org) {
        return res.status(404).json({
            success: false,
            message: "Organization not found",
            data: null,
            error: { code: "NOT_FOUND", details: "No organization found" }
        });
    }

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
            data: null,
            error: { code: "NOT_FOUND", details: "No user found" }
        });
    }

    try {
        const member = await getMember(org.id, user.id);
        if (!member) {
            return res.status(404).json({
                success: false,
                message: "Member not found",
                data: null,
                error: { code: "NOT_FOUND", details: "No member found" }
            });
        }

        return res.status(200).json({
            success: true,
            message: "Member retrieved",
            data: { member },
            error: null
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null,
            error: { code: "INTERNAL_ERROR", details: err.message }
        });
    }
};

// ==== Get all members of an org ====
const getAllMembersController = async (req, res) => {
    const { user } = req;
    const { slug } = req.params;
    if (!user?.valid) {
        return res.status(401).json({
            success: false,
            message: "Not authorized",
            data: null,
            error: { code: "UNAUTHORIZED", details: "Login required" }
        });
    }

    const org = await getOrganizationBySlug(slug);
    const org_id = org?.id;
    if (org?.owner_id !== user?.id) {
        return res.status(401).json({
            success: false,
            message: "Not authorized",
            data: null,
            error: { code: "UNAUTHORIZED", details: "Login required" }
        });
    }

    try {
        const members = await getAllMembers(org_id);
        return res.status(200).json({
            success: true,
            message: "Members retrieved",
            data: { members },
            error: null
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null,
            error: { code: "INTERNAL_ERROR", details: err.message }
        });
    }
};

// ==== Exports ====
module.exports = {
    healthCheck,
    registerOrganization,
    editOrganization,
    deleteOrganization,
    verifyOrganizationController,
    getOrganizationBySlugController,
    addMemberController,
    getAllMembersController,
    updateMemberRoleController,
    getMemberController
};
