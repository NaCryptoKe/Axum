const {
    createOrganization: createOrg,
    updateOrganization,
    softDeleteOrganization,
    getOrganizationById,
    verifyOrganization,
    getOrganizationBySlug,
    getUserOrganizations
} = require("../models/organizationModel");

const {
    addMember,
    updateMemberRole,
    getMember,
    getAllMembers,
    removeMember
} = require("../models/organizationMemberModel");

const { getUserByUsername } = require("../models/userModel");

const createOrganization = async (req, res) => {
    const { user } = req;
    if (!user?.valid) {
        return res.status(401).json({
            status: "error",
            message: "Not authorized",
            error: {
                code: "UNAUTHORIZED",
                details: "You must be logged in to create a new organization"
            },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }

    const { name } = req.body;
    if (!name || typeof name !== "string" || name.trim().length === 0) {
        return res.status(400).json({
            status: "error",
            message: "Invalid organization name",
            error: {
                code: "INVALID_INPUT",
                details: "Organization name is required and must be a non-empty string"
            },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }

    try {
        const organization = await createOrg({
            owner_id: user.id,
            name,
            slug: name.toLowerCase().replace(/\s+/g, '-'),
        });
        await addMember({ org_id: organization.id, user_id: user.id, role: 'owner' });
        return res.status(201).json({
            status: "success",
            message: "Organization created successfully",
            data: organization,
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error("Error creating organization:", error);
        if (error.code === "23505") { // unique_violation
            return res.status(409).json({
                status: "error",
                message: "Organization name already exists",
                error: {
                    code: "DUPLICATE_NAME",
                    details: "The provided name is already in use by another organization"
                },
                meta: {
                    timestamp: new Date().toISOString()
                }
            });
        }
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: {
                code: "INTERNAL_ERROR",
                details: error.message
            },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }
};

// ==== Health Check ====
const healthCheck = (req, res) => {
    return res.status(200).json({
        status: true,
        message: 'Organization router running',
        data: null,
        meta: {
            timestamp: new Date().toISOString()
        }
    });
};

// ==== Create Organization ====
const registerOrganization = async (req, res) => {
    const { user } = req;

    if (!user?.valid) {
        return res.status(401).json({
            status: "error",
            message: "Not authorized",
            error: {
                code: "UNAUTHORIZED",
                details: "You must be logged in to create a new organization"
            },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }

    const { name, slug, description, website_url } = req.body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
        return res.status(400).json({
            status: "error",
            message: "Invalid organization name",
            error: {
                code: "INVALID_INPUT",
                details: "Organization name is required and must be a non-empty string"
            },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }

    if (!slug || slug.trim().length === 0) {
        return res.status(400).json({
            status: "error",
            message: "Invalid organization name",
            error: {
                code: "INVALID_INPUT",
                details: "Organization name is required and must be a non-empty string"
            },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }

    try {
        const organization = await createOrg({
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
            status: "success",
            message: "Organization created successfully",
            data: { organization },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error("Error creating organization:", error);

        if (error.code === "23505") {
            return res.status(409).json({
                status: "error",
                message: "Organization slug already exists",
                error: {
                    code: "DUPLICATE_SLUG",
                    details: "The provided slug is already in use by another organization"
                },
                meta: {
                    timestamp: new Date().toISOString()
                }
            });
        }

        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: {
                code: "INTERNAL_ERROR",
                details: error.message
            },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }
};

// ==== Update Organization ====
const editOrganization = async (req, res) => {
    const { organization, user } = req; // from checkRole middleware
    const { name, slug, description, website_url } = req.body;

    try {
        const updatedOrganization = await updateOrganization(organization.id, user.id, {
            name,
            slug,
            description,
            website_url
        });

        if (!updatedOrganization) {
            return res.status(404).json({
                status: "error",
                message: "Organization not found or not owned by user",
                error: {
                    code: "NOT_FOUND",
                    details: "No organization found for the provided ID and user"
                },
                meta: {
                    timestamp: new Date().toISOString()
                }
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Organization updated successfully",
            data: { organization: updatedOrganization },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    } catch (err) {
        console.error("Error updating organization:", err);

        if (err.code === "23505") {
            return res.status(409).json({
                status: "error",
                message: "Slug already in use",
                error: {
                    code: "DUPLICATE_SLUG",
                    details: "Another organization already uses this slug"
                },
                meta: {
                    timestamp: new Date().toISOString()
                }
            });
        }

        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: {
                code: "INTERNAL_ERROR",
                details: err.message
            },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }
};

// ==== Delete Organization ====
const deleteOrganization = async (req, res) => {
    const { organization, user } = req; // from checkRole middleware

    try {
        const deletedOrganization = await softDeleteOrganization(organization.id, user.id);

        if (!deletedOrganization) {
            return res.status(404).json({
                status: "error",
                message: "Organization not found or not owned by you",
                error: {
                    code: "NOT_FOUND",
                    details: "No organization found for the provided ID and user"
                },
                meta: {
                    timestamp: new Date().toISOString()
                }
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Organization deleted successfully",
            data: { organization: deletedOrganization },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error("Error deleting organization:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: {
                code: "INTERNAL_ERROR",
                details: error.message
            },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }
};

// ==== Verify Organization ====
const verifyOrganizationController = async (req, res) => {
    const { organization, user } = req; // from checkRole middleware

    try {
        const verifiedOrganization = await verifyOrganization(organization.id, user.id);

        return res.status(200).json({
            status: "success",
            message: "Organization verified successfully",
            data: { organization: verifiedOrganization },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error("Error verifying organization:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: {
                code: "INTERNAL_ERROR",
                details: error.message
            },
            meta: {
                timestamp: new Date().toISOString()
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
                status: "error",
                message: "Organization not found",
                error: {
                    code: "NOT_FOUND",
                    details: "No organization exists with the provided slug"
                },
                meta: {
                    timestamp: new Date().toISOString()
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
            status: "success",
            message: "Organization retrieved successfully",
            data: { organization: responseData },
            meta: {
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error("Error fetching organization by slug:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: {
                code: "INTERNAL_ERROR",
                details: error.message
            },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }
};

// ==== Join Organization ====
const joinOrganizationController = async (req, res) => {
    const { user } = req;
    const { slug } = req.params;

    if (!user?.valid) {
        return res.status(401).json({
            status: "error",
            message: "Not authorized",
            error: { code: "UNAUTHORIZED", details: "Login required" },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }
    const org = await getOrganizationBySlug(slug);
    if (!org) {
        return res.status(404).json({
            status: "error",
            message: "Organization not found",
            error: { code: "NOT_FOUND", details: "No organization found" },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }

    const existingMember = await getMember(org.id, user.id);
    if (existingMember) {
        return res.status(409).json({
            status: "error",
            message: "You are already a member of this organization.",
            error: { code: "CONFLICT", details: "User is already a member" },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }

    try {
        const member = await addMember({ org_id: org.id, user_id: user.id });
        return res.status(201).json({
            status: "success",
            message: "Successfully joined the organization",
            data: { member },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: { code: "INTERNAL_ERROR", details: err.message },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }
};

// ==== Add member by Admin ====
const addMemberByAdminController = async (req, res) => {
    const { username, role } = req.body;
    const { organization } = req; // from checkRole middleware

    const targetUser = await getUserByUsername(username);
    if (!targetUser) {
        return res.status(404).json({
            status: "error",
            message: "User to add not found.",
            error: { code: "NOT_FOUND", details: "User to add not found." },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }

    const existingMember = await getMember(organization.id, targetUser.id);
    if (existingMember) {
        return res.status(409).json({
            status: "error",
            message: "User is already a member of this organization.",
            error: { code: "CONFLICT", details: "User is already a member of this organization." },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }

    try {
        const member = await addMember({ org_id: organization.id, user_id: targetUser.id, role: role || 'member' });
        return res.status(201).json({
            status: "success",
            message: "Member added successfully",
            data: { member },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: { code: "INTERNAL_ERROR", details: err.message },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }
};

// ==== Update member role ====
const updateMemberRoleController = async (req, res) => {
    const { user } = req;
    const { username, role } = req.body;
    const { slug } = req.params;

    // Step 1: Check if logged in (redundant with middleware, but good for safety)
    if (!user?.valid) {
        return res.status(401).json({
            status: "error",
            message: "Not authorized",
            error: { code: "UNAUTHORIZED", details: "Login required" },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }

    // Step 2: Get target user and organization
    const targetUser = await getUserByUsername(username);
    const org = await getOrganizationBySlug(slug);

    if (!targetUser || !org) {
        return res.status(404).json({
            status: "error",
            message: "User or organization not found",
            error: { code: "NOT_FOUND", details: "Invalid username or organization slug" },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }

    const org_id = org.id;
    const target_user_id = targetUser.id;

    // Step 3: Get logged-in user's role in the org
    const currentUserMember = await getMember(org_id, user.id);
    if (!currentUserMember) {
        return res.status(403).json({
            status: "error",
            message: "Forbidden",
            error: { code: "FORBIDDEN", details: "You are not a member of this organization" },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }

    // Step 4: Get target user's role in the org
    const targetMember = await getMember(org_id, target_user_id);
    if (!targetMember) {
        return res.status(404).json({
            status: "error",
            message: "Member not found",
            error: { code: "NOT_FOUND", details: "Target user is not a member of this org" },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }

    const actorRole = currentUserMember.role;
    const targetRole = targetMember.role;

    // Step 5: Prevent self-promotion to owner
    if (target_user_id === user.id && role === 'owner') {
        return res.status(403).json({
            status: "error",
            message: "Forbidden",
            error: { code: "FORBIDDEN", details: "You cannot promote yourself to owner" },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }

    // Step 6: RBAC rules for managing others
    if (target_user_id !== user.id) { // only applies when managing someone else
        if (actorRole === 'owner') {
            if (targetRole === 'owner') {
                return res.status(403).json({
                    status: "error",
                    message: "Forbidden",
                    error: { code: "FORBIDDEN", details: "Owners cannot manage other owners" },
                    meta: {
                        timestamp: new Date().toISOString()
                    }
                });
            }
        } else if (actorRole === 'admin') {
            if (['owner', 'admin'].includes(targetRole)) {
                return res.status(403).json({
                    status: "error",
                    message: "Forbidden",
                    error: { code: "FORBIDDEN", details: "Admins cannot manage owners or other admins" },
                    meta: {
                        timestamp: new Date().toISOString()
                    }
                });
            }
            if (role === 'owner') {
                return res.status(403).json({
                    status: "error",
                    message: "Forbidden",
                    error: { code: "FORBIDDEN", details: "Admins cannot promote anyone to owner" },
                    meta: {
                        timestamp: new Date().toISOString()
                    }
                });
            }
        } else {
            return res.status(403).json({
                status: "error",
                message: "Forbidden",
                error: { code: "FORBIDDEN", details: "Only admins or owners can manage member roles" },
                meta: {
                    timestamp: new Date().toISOString()
                }
            });
        }
    }

    // Step 7: Validate new role
    const validRoles = ['member','moderator','developer','finance','admin','owner'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({
            status: "error",
            message: "Invalid role",
            error: { code: "INVALID_ROLE", details: "Role must be one of " + validRoles.join(", ") },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }

    // Step 8: Update role
    try {
        const updatedMember = await updateMemberRole(org_id, target_user_id, role);
        return res.status(200).json({
            status: "success",
            message: "Member role updated successfully",
            data: { member: updatedMember },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: { code: "INTERNAL_ERROR", details: err.message },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }
};

// ==== Remove Member ====
const removeMemberController = async (req, res) => {
    const { user } = req;
    const { slug, username } = req.params;

    const targetUser = await getUserByUsername(username);
    const org = await getOrganizationBySlug(slug);

    if (!targetUser || !org) {
        return res.status(404).json({
            status: "error",
            message: "User or organization not found",
            error: { code: "NOT_FOUND", details: "User or organization not found" },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }

    const org_id = org.id;
    const target_user_id = targetUser.id;

    const currentUserMember = await getMember(org_id, user.id);
    const targetMember = await getMember(org_id, target_user_id);

    if (!targetMember) {
        return res.status(404).json({
            status: "error",
            message: "Target user is not a member",
            error: { code: "NOT_FOUND", details: "Target user is not a member" },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }

    const actorRole = currentUserMember ? currentUserMember.role : null;
    const targetRole = targetMember.role;

    // Case 1: User is leaving the organization
    if (target_user_id === user.id) {
        if (targetRole === 'owner') {
            return res.status(403).json({
                status: "error",
                message: "Forbidden",
                error: { code: "FORBIDDEN", details: "Owner cannot leave the organization. Please transfer ownership first." },
                meta: {
                    timestamp: new Date().toISOString()
                }
            });
        }
        try {
            await removeMember(org_id, user.id);
            return res.status(200).json({
                status: "success",
                message: "Successfully left the organization",
                data: null,
                meta: {
                    timestamp: new Date().toISOString()
                }
            });
        } catch (err) {
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
                error: { code: "INTERNAL_ERROR", details: err.message },
                meta: {
                    timestamp: new Date().toISOString()
                }
            });
        }
    }

    // Case 2: User is removing another member (requires privileges)
    if (!['owner', 'admin'].includes(actorRole)) {
        return res.status(403).json({
            status: "error",
            message: "Forbidden",
            error: { code: "FORBIDDEN", details: "You do not have permission to remove members" },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }
    if (actorRole === 'admin' && ['owner', 'admin'].includes(targetRole)) {
        return res.status(403).json({
            status: "error",
            message: "Forbidden",
            error: { code: "FORBIDDEN", details: "Admins cannot remove other admins or owners" },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }
    if (actorRole === 'owner' && targetRole === 'owner') {
        return res.status(403).json({
            status: "error",
            message: "Forbidden",
            error: { code: "FORBIDDEN", details: "Owners cannot remove other owners" },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }

    try {
        await removeMember(org_id, target_user_id);
        return res.status(200).json({
            status: "success",
            message: "Member removed successfully",
            data: null,
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: { code: "INTERNAL_ERROR", details: err.message },
            meta: {
                timestamp: new Date().toISOString()
            }
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
            status: "error",
            message: "Organization not found",
            error: { code: "NOT_FOUND", details: "No organization found" },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }

    if (!user) {
        return res.status(404).json({
            status: "error",
            message: "User not found",
            error: { code: "NOT_FOUND", details: "No user found" },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }

    try {
        const member = await getMember(org.id, user.id);
        if (!member) {
            return res.status(404).json({
                status: "error",
                message: "Member not found",
                error: { code: "NOT_FOUND", details: "No member found" },
                meta: {
                    timestamp: new Date().toISOString()
                }
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Member retrieved",
            data: { member },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: { code: "INTERNAL_ERROR", details: err.message },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }
};

// ==== Get all members of an org ====
const getAllMembersController = async (req, res) => {
    const { user } = req;
    const { slug } = req.params;
    if (!user?.valid) {
        return res.status(401).json({
            status: "error",
            message: "Not authorized",
            error: { code: "UNAUTHORIZED", details: "Login required" },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }

    const org = await getOrganizationBySlug(slug);
    if (!org) {
        return res.status(404).json({
            status: "error",
            message: "Organization not found",
            error: { code: "NOT_FOUND", details: "No organization found with that slug." },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }

    const member = await getMember(org.id, user.id);
    if (!member) {
         return res.status(403).json({
            status: "error",
            message: 'You must be a member to view the member list.',
            error: { code: "FORBIDDEN", details: "You are not a member of this organization." },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }

    try {
        const members = await getAllMembers(org.id);
        return res.status(200).json({
            status: "success",
            message: "Members retrieved",
            data: { members },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: { code: "INTERNAL_ERROR", details: err.message },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }
};

const getUserOrganizationsControl = async (req, res) => {
        const { userId } = req.params;
        try {
            const organizations = await getUserOrganizations(userId);
            return res.status(200).json({
                status: "success",
                message: "Organizations retrieved successfully",
                data: organizations,
                meta: {
                    timestamp: new Date().toISOString()
                }
            });
        } catch (error) {
            console.error("Error fetching user organizations:", error);
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
                error: {
                    code: "INTERNAL_ERROR",
                    details: error.message
                },
                meta: {
                    timestamp: new Date().toISOString()
                }
            });
        }
    }

// ==== Exports ====
module.exports = {
    healthCheck,
    editOrganization,
    deleteOrganization,
    verifyOrganizationController,
    getOrganizationBySlugController,
    joinOrganizationController,
    addMemberByAdminController,
    getAllMembersController,
    updateMemberRoleController,
    getMemberController,
    removeMemberController,
    createOrganization,
    getUserOrganizationsControl
};
