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
} = require('../models/userModel');
const jwt = require("jsonwebtoken");
require('dotenv').config();

// ==== FINISHED ====
const getUserProfile = async (req, res) => {
    const { username } = req.params;
    const { valid, username_cookie } = req.user;

    try {
        const user = await getUserByUsername(username);

        if (!user) return res.status(404).json({
            success: false,
            message: 'User not found',
            data: null,
            error: {
                code: 404,
                details: `User by the name of ${username} does not exist`,
            }
        });
        if (user.is_deleted) return res.status(404).json({
            success: false,
            message: 'Deactivated user',
            data: null,
            error: {
                code: 404,
                details: `User by the name of ${username} has deactivated their account`,
            }
        });

        const online = await isUserOnline(user.id);

        if ((valid && username_cookie === username) || req.user.role === 'admin') {
            return res.status(200).json({
                success: true,
                message: 'User data',
                data: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    displayName: user.display_name,
                    email_verified: user.email_verified,
                    role: user.role,
                    profilePicture: user.avatar_url,
                    bio: user.bio,
                    createdAt: user.created_at,
                    isOnline: online
                },
                error: null
            });
        }

        return res.status(200).json({
            success: true,
            message: 'User data',
            data: {
                id: user.id,
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname,
                displayName: user.display_name,
                role: user.role,
                profilePicture: user.avatar_url,
                bio: user.bio,
                createdAt: user.created_at,
                isOnline: online,
            },
            error: null
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server Error',
            data: null,
            error: {
                code: 500,
                details: `Server Error`,
            }
        })
    }
};

const onlineStatus = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await getUserByUsername(username);

        if (!user) return res.status(404).json({
            success: false,
            message: 'User not found',
            data: null,
            error: {
                code: 404,
                details: `User by the name of ${username} does not exist`,
            }
        });

        const online = await isUserOnline(user.id);
        const lastSeenAt = await lastSeen(user.id);

        return res.status(200).json({
            success: true,
            message: 'User online status',
            data: {
                username: username,
                online: online ? 'Online' : 'Offline',
                last_seen_at: lastSeenAt,
            }
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server Error',
            data: null,
            error: {
                code: 500,
                details: `Server Error`,
            }
        });
    }
};

const updateProfile = async (req, res) => {
    const { user } = req;
    const { username } = req.params;

    const isOwner = username === user.username_cookie;
    const isAdmin = user.role === 'admin';

    if (!user?.valid || (!isOwner && !isAdmin)) {
        return res.status(401).json({
            success: false,
            message: "Not authorized",
            data: null,
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
        if (isOwner) {
            targetUser = { id: user.id };
        } else if (isAdmin) {
            targetUser = await getUserByUsername(username);
            if (!targetUser) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found',
                    data: null,
                    error: {
                        code: 404,
                        details: `User by the name of ${username} does not exist`,
                    }
                });
            }
        }

        if (!newUsername || !email || !bio || !display_name) {
            return res.status(400).json({
                success: false,
                message: "Bad Request",
                data: null,
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
                success: false,
                message: "Unprocessable inputs",
                data: null,
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
                success: false,
                message: 'User not updated',
                data: null,
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
            success: true,
            message: "Successfully updated user",
            data: {
                id: targetUser.id,
                username: cleanedUsername,
            },
            error: null
        });
    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            data: null,
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
            success: false,
            message: "Not authorized",
            data: null,
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
                    success: false,
                    message: 'User not found',
                    data: null,
                    error: {
                        code: 404,
                        details: `User by the name of ${username} does not exist`,
                    }
                });
            }
        }

        if (!avatar_url)
            return res.status(400).json({
                success: false,
                message: "Missing Credential",
                data: null,
                error: {
                    code: 400,
                    details: 'Missing avatar url',
                }
            });

        const result = await updateUserProfilePicture({id: targetUser.id, avatar_url});

        if (!result)
            return res.status(400).json({
                success: false,
                message: 'User avtar not updated',
                data: null,
                error: {
                    code: 400,
                    details: 'User account avatar not updated'
                }
            });

        return res.status(200).json({
            success: true,
            message: 'Successfully updated user avatar',
            data: {
                avatar_url: result.avatar_url,
            },
            error: null
        });
    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            data: null,
            error: {
                code: 500,
                details: error.message
            }
        });
    }
}

const allUsers = async (req, res) => {
    const { user } = req;

    if (!user?.valid || (user.role !== 'admin' && user.role !== 'moderator')) {
        return res.status(401).json({
            success: false,
            message: "Not authorized",
            data: null,
            error: {
                code: 401,
                details: "You must be an admin or a moderator",
            }
        });
    }
    try {
        const users = await getAllUsers();
        if (!users || users.length === 0)
            return res.status(404).json({
                success: false,
                message: 'No users found',
                data: null,
                error: {
                    code: 404,
                    details: `No users found`,
                }
            });

        const formattedUsers = users.map(user => ({
            user_id: user.id,
            username: user.username,
            email: user.email,
            email_verified: user.email_verified,
            displayName: user.display_name,
            avatar_url: user.avatar_url,
            role: user.role,
            deleted_at: user.is_deleted ? user.deleted_at : null,
            created: user.created_at,
            updated: user.updated_at
        }));
        return res.status(200).json({
            success: true,
            message: "All users found",
            data: { "All Users": formattedUsers },
            error: null
        });
    } catch (error) {
        console.error("Get All User Sessions Error:", error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            data: null,
            error: {
                code: 500,
                details: error.message
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
            success: false,
            message: "Not authorized",
            data: null,
            error: {
                code: 401,
                details: "You must be logged in and can only delete your own account or be an Admin/Moderator."
            }
        });
    }

    try {
        if (!username) return res.status(400).json({
            success: false,
            message: 'Missing username',
            data: null,
            error: {
                code: 404,
                details: `Username wasn't provided`,
            }
        });
        const result = await softDeleteUser(username);

        if (!result) return res.status(400).json({
            success: false,
            message: 'User not found',
            data: null,
            error: {
                code: 404,
                details: `User by the name of ${username} does not exist`,
            }
        });

        return res.status(200).json({
            success: true,
            message: 'User Deleted',
            data: {
                username: username,
                deleted: true
            },
            error: null
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Server Error',
            data: null,
            error: {
                code: 500,
                details: `Server Error`,
            }
        });
    }
}

const allActiveUsers = async (req, res) => {
    try {
        const users = await getAllActiveUsers();
        if (!users || users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No active users found',
                data: null,
                error: {
                    code: 404,
                    details: 'There are currently no active users.'
                }
            });
        }
        
        const formattedUsers = users.map(u => ({
            username: u.username,
            display_name: u.display_name,
            avatar_url: u.avatar_url
        }));

        return res.status(200).json({
            success: true,
            message: 'Active users retrieved successfully.',
            data: { users: formattedUsers },
            error: null,
        });
    } catch (error) {
        console.error("Error getting active users:", error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            data: null,
            error: {
                code: 500,
                details: error.message,
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
            success: false,
            message: "Forbidden",
            error: { code: 403, details: "Only administrators can change user roles." }
        });
    }

    // 2. Input validation
    if (!username || !newRole) {
        return res.status(400).json({
            success: false,
            message: "Bad Request",
            error: { code: 400, details: "Username and new role are required." }
        });
    }
    
    const VALID_ROLES = ['player', 'creator', 'moderator', 'admin'];
    if (!VALID_ROLES.includes(newRole)) {
        return res.status(422).json({
            success: false,
            message: "Invalid Role",
            error: { code: 422, details: `Role must be one of: ${VALID_ROLES.join(', ')}` }
        });
    }

    try {
        const targetUser = await getUserByUsername(username);
        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                error: { code: 404, details: `User '${username}' not found.` }
            });
        }

        // 3. Authorization rules
        if (targetUser.id === actor.id) {
            return res.status(403).json({
                success: false,
                message: "Forbidden",
                error: { code: 403, details: "Administrators cannot change their own role." }
            });
        }
        if (targetUser.role === 'admin') {
             return res.status(403).json({
                success: false,
                message: "Forbidden",
                error: { code: 403, details: "Administrators cannot change the role of other administrators." }
            });
        }

        // 4. Update role
        const updatedUser = await updateUserRole({ id: targetUser.id, role: newRole });

        return res.status(200).json({
            success: true,
            message: `User ${updatedUser.username}'s role updated to ${updatedUser.role}.`,
            data: updatedUser,
            error: null
        });

    } catch (error) {
        console.error("Change user role error:", error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: { code: 500, details: error.message }
        });
    }
};

const permanentDeleteUserController = async (req, res) => {
    const { user: actor } = req;
    const { username } = req.params;

    if (actor?.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: "Forbidden",
            error: { code: 403, details: "Only administrators can permanently delete users." }
        });
    }

    try {
        const targetUser = await getUserByUsername(username);
        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                error: { code: 404, details: `User '${username}' not found.` }
            });
        }
        
        if (targetUser.id === actor.id) {
             return res.status(403).json({
                success: false,
                message: "Forbidden",
                error: { code: 403, details: "Administrators cannot delete their own account this way." }
            });
        }

        const deletedCount = await permanentDeleteUser(targetUser.id);

        if (deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found or already deleted.",
                error: { code: 404 }
            });
        }

        return res.status(200).json({
            success: true,
            message: `User '${username}' has been permanently deleted.`,
            data: null,
            error: null
        });

    } catch (error) {
        console.error("Permanent delete user error:", error);
        // Check for foreign key violation
        if (error.code === '23503') {
            return res.status(409).json({
                success: false,
                message: "Conflict: User cannot be deleted.",
                error: {
                    code: 409,
                    details: "This user cannot be deleted because they are referenced by other records (e.g., they own an organization or have made financial transactions)."
                }
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: { code: 500, details: error.message }
        });
    }
};

module.exports = {
    getUserProfile,
    onlineStatus,
    updateProfile,
    allUsers,
    allActiveUsers,
    updateProfilePicture,
    softDelete,
    changeUserRole,
    permanentDeleteUserController,
}