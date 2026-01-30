const {lastSeen, isUserOnline} = require("../models/lastSeenModel");
const {
    updateUserProfile,
    getUserByUsername,
    getAllUsers,
    getAllActiveUsers,
    softDeleteUser,
    updateUserProfilePicture,
    updateUserRole,
    permanentDeleteUser,
    undeleteUser,
    getUserByUsernameIncludingDeleted,
} = require('../models/userModel');
const jwt = require("jsonwebtoken");
require('dotenv').config();

// ==== FINISHED ====
const getUserProfile = async (req, res) => {
    const { username } = req.params;
    // Extract the viewer's ID from req.user (populated by your auth middleware)
    const { id: viewerId, valid, username_cookie, role } = req.user;

    try {
        // Pass viewerId to the model to check if they are following this user
        const user = await getUserByUsername(username, viewerId);

        if (!user) return res.status(404).json({
            status: "error",
            message: 'User not found',
            error: {
                code: 404,
                details: `User by the name of ${username} does not exist`,
            }
        });

        if (user.is_deleted) return res.status(404).json({
            status: "error",
            message: 'Deactivated user',
            error: {
                code: 404,
                details: `User by the name of ${username} has deactivated their account`,
            }
        });

        const online = await isUserOnline(user.id);

        // Common data for both views
        const publicData = {
            id: user.id,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            displayName: user.displayName, // Alias used in SQL
            role: user.role,
            profilePicture: user.profilePicture, // Alias used in SQL
            bio: user.bio,
            createdAt: user.createdAt, // Alias used in SQL
            isOnline: online,
            isFollowing: user.isFollowing, // <-- This is the new logic
            followerCount: parseInt(user.followerCount) || 0,
            followingCount: parseInt(user.followingCount) || 0
        };

        // If it's the owner or an admin, add sensitive data
        if ((valid && username_cookie === username) || role === 'admin') {
            return res.status(200).json({
                status: "success",
                message: 'User data',
                data: {
                    ...publicData,
                    email: user.email,
                    email_verified: user.email_verified,
                },
                meta: { timestamp: new Date().toISOString() }
            });
        }

        // Return standard public view
        return res.status(200).json({
            status: "success",
            message: 'User data',
            data: publicData,
            meta: { timestamp: new Date().toISOString() }
        });

    } catch (error) {
        console.error("Profile Fetch Error:", error);
        return res.status(500).json({
            status: "error",
            message: 'Server Error',
            error: { code: 500, details: `Internal Server Error` }
        });
    }
};
const onlineStatus = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await getUserByUsername(username);

        if (!user) return res.status(404).json({
            status: "error",
            message: 'User not found',
            error: {
                code: 404,
                details: `User by the name of ${username} does not exist`,
            }
        });

        const online = await isUserOnline(user.id);
        const lastSeenAt = await lastSeen(user.id);

        return res.status(200).json({
            status: "success",
            message: 'User online status',
            data: {
                username: username,
                online: online ? 'Online' : 'Offline',
                last_seen_at: lastSeenAt,
            },
            meta: {
                timestamp: new Date().toISOString(),
            }
        })
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: 'Server Error',
            error: {
                code: 500,
                details: `Server Error`,
            }
        });
    }
};

const updateProfile = async (req, res) => {
    console.log("HELLo")
    const { user } = req;
    const { username } = req.params;

    const isOwner = username === user.username_cookie;
    const isAdmin = user.role === 'admin';
    
    if (!user?.valid || (!isOwner && !isAdmin)) {
        return res.status(401).json({
            status: "error",
            message: "Not authorized",
            error: {
                code: 401,
                details: "You must be logged in and can only edit your own account or be an Admin."
            }
        });
    }

    const unprocessableErrors = [];
    const { bio, display_name } = req.body;
    let { newUsername, email } = req.body;

    try {
        let targetUser;
        console.log (targetUser)
        if (isOwner) {
            targetUser = { id: user.id };
        } else if (isAdmin) {
            targetUser = await getUserByUsername(username);
            if (!targetUser) {
                return res.status(404).json({
                    status: "error",
                    message: 'User not found',
                    error: {
                        code: 404,
                        details: `User by the name of ${username} does not exist`,
                    }
                });
            }
        }

        if (!newUsername || !email || !bio || !display_name) {
            return res.status(400).json({
                status: "error",
                message: "Bad Request",
                error: {
                    code: 400,
                    details: 'Missing Credentials'
                }
            });
        }

        const cleanedUsername = newUsername.toLowerCase().trim();
        const cleanedEmail = email.toLowerCase().trim();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) unprocessableErrors.push('Email addresses should follow, example@example.com')

        if (!/^[A-Za-z0-9_]{4,}$/.test(newUsername)) unprocessableErrors.push('Usernames can only have alphanumeric characters and underscores.');

        if (unprocessableErrors.length > 0)
            return res.status(422).json({
                status: "error",
                message: "Unprocessable inputs",
                error: {
                    code: 422,
                    details: unprocessableErrors
                }
            });

        const updatedUser = await updateUserProfile({
            id: targetUser.id,
            username: cleanedUsername,
            email: cleanedEmail,
            bio,
            display_name,
        });

        if (!updatedUser)
            return res.status(400).json({
                status: "error",
                message: 'User not updated',
                error: {
                    code: 400,
                    details: 'User account not updated'
                }
            });
        
        if (isOwner) {
            const newToken = jwt.sign(
                {
                    id: targetUser.id,
                    username: cleanedUsername,
                    role: user.role,
                    sessionId: user.session_id_cookie,
                },
                process.env.SECRET_STRING,
                { algorithm: 'HS256', expiresIn: '7d' }
            );
    
            res.cookie('token', newToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Successfully updated user",
            data: {
                id: targetUser.id,
                username: cleanedUsername,
            },
            meta: {
                timestamp: new Date().toISOString(),
            }
        });
    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({
            status: "error",
            message: 'Server error',
            error: {
                code: 500,
                details: error.message
            }
        });
    }
}

const updateProfilePicture = async (req, res) => {
    const { user } = req;
    const { avatar_url } = req.body;
    const username = req.params.username;

    const isOwner = username === user.username_cookie;
    const isAdmin = user.role === 'admin';

    if (!user?.valid || (!isOwner && !isAdmin)) {
        return res.status(401).json({
            status: "error",
            message: "Not authorized",
            error: {
                code: 401,
                details: "You must be logged in and can only edit your own account or be an Admin."
            }
        });
    }

    try {
        let targetUser;
        if (isOwner) {
            targetUser = { id: user.id };
        } else if (isAdmin) {
            targetUser = await getUserByUsername(username);
            if (!targetUser) {
                return res.status(404).json({
                    status: "error",
                    message: 'User not found',
                    error: {
                        code: 404,
                        details: `User by the name of ${username} does not exist`,
                    }
                });
            }
        }

        if (!avatar_url)
            return res.status(400).json({
                status: "error",
                message: "Missing Credential",
                error: {
                    code: 400,
                    details: 'Missing avatar url',
                }
            });

        const result = await updateUserProfilePicture({id: targetUser.id, avatar_url});

        if (!result)
            return res.status(400).json({
                status: "error",
                message: 'User avtar not updated',
                error: {
                    code: 400,
                    details: 'User account avatar not updated'
                }
            });

        return res.status(200).json({
            status: "success",
            message: 'Successfully updated user avatar',
            data: {
                avatar_url: result.avatar_url,
            },
            meta: {
                timestamp: new Date().toISOString(),
            }
        });
    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({
            status: "error",
            message: 'Server error',
            error: {
                code: 500,
                details: error.message
            }
        });
    }
}

const allUsers = async (req, res) => {
    const { user } = req;
    const { page = 1, limit = 10 } = req.query;

    if (!user?.valid || (user.role !== 'admin' && user.role !== 'moderator')) {
        return res.status(401).json({
            status: "error",
            message: "Not authorized",
            error: {
                code: "UNAUTHORIZED",
                details: "You must be an admin or a moderator"
            },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }
    try {
        const users = await getAllUsers();
        if (!users || users.length === 0)
            return res.status(404).json({
                status: "error",
                message: 'No users found',
                error: {
                    code: "NOT_FOUND",
                    details: `No users found`,
                },
                meta: {
                    timestamp: new Date().toISOString()
                }
            });
        
        const totalRecords = users.length;
        const totalPages = Math.ceil(totalRecords / limit);
        const offset = (page - 1) * limit;
        const paginatedUsers = users.slice(offset, offset + limit);

        const formattedUsers = paginatedUsers.map(user => ({
            userId: user.id,
            username: user.username,
            email: user.email,
            emailVerified: user.email_verified,
            displayName: user.display_name,
            avatarUrl: user.avatar_url,
            role: user.role,
            deletedAt: user.is_deleted ? user.deleted_at : null,
            createdAt: user.created_at,
            updatedAt: user.updated_at
        }));

        return res.status(200).json({
            status: "success",
            data: formattedUsers,
            pagination: {
                totalRecords,
                currentPage: parseInt(page),
                totalPages,
                limit: parseInt(limit),
                hasNext: page < totalPages,
                hasPrev: page > 1
            },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error("Get All User Sessions Error:", error);
        return res.status(500).json({
            status: "error",
            message: 'Server error',
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

const softDelete = async (req, res) => {
    const { user } = req;
    const { username } = req.params;

    const isOwner = username === user.username_cookie;
    const isAdminOrModerator = user.role === 'admin' || user.role === 'moderator';

    if (!user?.valid || (!isOwner && !isAdminOrModerator)) {
        return res.status(401).json({
            status: "error",
            message: "Not authorized",
            error: {
                code: "UNAUTHORIZED",
                details: "You must be logged in and can only delete your own account or be an Admin/Moderator."
            },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }

    try {
        if (!username) return res.status(400).json({
            status: "error",
            message: 'Missing username',
            error: {
                code: "BAD_REQUEST",
                details: `Username wasn't provided`,
            },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
        const result = await softDeleteUser(username);

        if (!result) return res.status(404).json({
            status: "error",
            message: 'User not found',
            error: {
                code: "NOT_FOUND",
                details: `User by the name of ${username} does not exist`,
            },
            meta: {
                timestamp: new Date().toISOString()
            }
        });

        return res.status(200).json({
            status: "success",
            data: {
                username: username,
                deleted: true
            },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            message: 'Server Error',
            error: {
                code: "INTERNAL_ERROR",
                details: `Server Error`,
            },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }
}

const allActiveUsers = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const users = await getAllActiveUsers();
        if (!users || users.length === 0) {
            return res.status(404).json({
                status: "error",
                message: 'No active users found',
                error: {
                    code: "NOT_FOUND",
                    details: 'There are currently no active users.'
                },
                meta: {
                    timestamp: new Date().toISOString()
                }
            });
        }
        
        const totalRecords = users.length;
        const totalPages = Math.ceil(totalRecords / limit);
        const offset = (page - 1) * limit;
        const paginatedUsers = users.slice(offset, offset + limit);

        const formattedUsers = paginatedUsers.map(u => ({
            username: u.username,
            displayName: u.display_name,
            avatarUrl: u.avatar_url
        }));

        return res.status(200).json({
            status: "success",
            data: formattedUsers,
            pagination: {
                totalRecords,
                currentPage: parseInt(page),
                totalPages,
                limit: parseInt(limit),
                hasNext: page < totalPages,
                hasPrev: page > 1
            },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error("Error getting active users:", error);
        res.status(500).json({
            status: "error",
            message: 'Server error',
            error: {
                code: "INTERNAL_ERROR",
                details: error.message,
            },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }
}


const changeUserRole = async (req, res) => {
    const { user: actor } = req;
    const { username, role: newRole } = req.body;

    // 1. Admin check
    if (actor?.role !== 'admin') {
        return res.status(403).json({
            status: "error",
            message: "Forbidden",
            error: { code: 403, details: "Only administrators can change user roles." },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }

    // 2. Input validation
    if (!username || !newRole) {
        return res.status(400).json({
            status: "error",
            message: "Bad Request",
            error: { code: 400, details: "Username and new role are required." },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }
    
    const VALID_ROLES = ['player', 'creator', 'moderator', 'admin'];
    if (!VALID_ROLES.includes(newRole)) {
        return res.status(422).json({
            status: "error",
            message: "Invalid Role",
            error: { code: 422, details: `Role must be one of: ${VALID_ROLES.join(', ')}` },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }

    try {
        const targetUser = await getUserByUsername(username);
        if (!targetUser) {
            return res.status(404).json({
                status: "error",
                message: "User not found",
                error: { code: 404, details: `User '${username}' not found.` },
                meta: {
                    timestamp: new Date().toISOString()
                }
            });
        }

        // 3. Authorization rules
        if (targetUser.id === actor.id) {
            return res.status(403).json({
                status: "error",
                message: "Forbidden",
                error: { code: 403, details: "Administrators cannot change their own role." },
                meta: {
                    timestamp: new Date().toISOString()
                }
            });
        }
        if (targetUser.role === 'admin') {
             return res.status(403).json({
                status: "error",
                message: "Forbidden",
                error: { code: 403, details: "Administrators cannot change the role of other administrators." },
                meta: {
                    timestamp: new Date().toISOString()
                }
            });
        }

        // 4. Update role
        const updatedUser = await updateUserRole({ id: targetUser.id, role: newRole });

        return res.status(200).json({
            status: "success",
            message: `User ${updatedUser.username}'s role updated to ${updatedUser.role}.`,
            data: updatedUser,
            meta: {
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error("Change user role error:", error);
        return res.status(500).json({
            status: "error",
            message: 'Server error',
            error: { code: 500, details: error.message },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }
};

const permanentDeleteUserController = async (req, res) => {
    const { user: actor } = req;
    const { username } = req.params;

    if (actor?.role !== 'admin') {
        return res.status(403).json({
            status: "error",
            message: "Forbidden",
            error: { code: 403, details: "Only administrators can permanently delete users." },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }

    try {
        const targetUser = await getUserByUsername(username);
        if (!targetUser) {
            return res.status(404).json({
                status: "error",
                message: "User not found",
                error: { code: 404, details: `User '${username}' not found.` },
                meta: {
                    timestamp: new Date().toISOString()
                }
            });
        }
        
        if (targetUser.id === actor.id) {
             return res.status(403).json({
                status: "error",
                message: "Forbidden",
                error: { code: 403, details: "Administrators cannot delete their own account this way." },
                meta: {
                    timestamp: new Date().toISOString()
                }
            });
        }

        const deletedCount = await permanentDeleteUser(targetUser.id);

        if (deletedCount === 0) {
            return res.status(404).json({
                status: "error",
                message: "User not found or already deleted.",
                error: { code: 404 },
                meta: {
                    timestamp: new Date().toISOString()
                }
            });
        }

        return res.status(200).json({
            status: "success",
            message: `User '${username}' has been permanently deleted.`,
            data: null,
            meta: {
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error("Permanent delete user error:", error);
        // Check for foreign key violation
        if (error.code === '23503') {
            return res.status(409).json({
                status: "error",
                message: "Conflict: User cannot be deleted.",
                error: {
                    code: 409,
                    details: "This user cannot be deleted because they are referenced by other records (e.g., they own an organization or have made financial transactions)."
                },
                meta: {
                    timestamp: new Date().toISOString()
                }
            });
        }

        return res.status(500).json({
            status: "error",
            message: 'Server error',
            error: { code: 500, details: error.message },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }
};

const undeleteUserController = async (req, res) => {
    const { user: actor } = req;
    const { username } = req.params;

    if (actor?.role !== 'admin') {
        return res.status(403).json({
            status: "error",
            message: "Forbidden",
            error: { code: 403, details: "Only administrators can undelete user accounts." },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }

    try {
        const targetUser = await getUserByUsernameIncludingDeleted(username); 

        if (!targetUser) {
            return res.status(404).json({
                status: "error",
                message: "User not found.",
                error: { code: 404, details: `User '${username}' not found.` },
                meta: {
                    timestamp: new Date().toISOString()
                }
            });
        }

        if (!targetUser.is_deleted) {
            return res.status(400).json({
                status: "error",
                message: "User is not soft-deleted.",
                error: { code: 400, details: `User '${username}' is not currently soft-deleted.` },
                meta: {
                    timestamp: new Date().toISOString()
                }
            });
        }
        
        const result = await undeleteUser(username);

        if (!result) {
            return res.status(400).json({
                status: "error",
                message: "User account could not be undeleted.",
                error: { code: 400, details: `An error occurred while attempting to undelete user '${username}'.` },
                meta: {
                    timestamp: new Date().toISOString()
                }
            });
        }

        return res.status(200).json({
            status: "success",
            message: `User '${username}' has been successfully undeleted.`,
            data: {
                username: result.username,
                is_deleted: result.is_deleted,
                deleted_at: result.deleted_at
            },
            meta: {
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error("Undelete user error:", error);
        return res.status(500).json({
            status: "error",
            message: 'Server error',
            error: { code: 500, details: error.message },
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }
};

const getUserOrganization = async (req, res) => {

}

module.exports = {
    getUserProfile,
    getUserOrganization,
    onlineStatus,
    updateProfile,
    allUsers,
    allActiveUsers,
    updateProfilePicture,
    softDelete,
    changeUserRole,
    permanentDeleteUserController,
    undeleteUserController,
}