const {lastSeen, isUserOnline} = require("../models/lastSeenModel");
const {
    updateUserProfile,
    getUserByUsername,
    getAllUsers,
    getAllActiveUsers,
    softDeleteUser,
    updateUserProfilePicture
} = require('../models/userModel');
const jwt = require("jsonwebtoken");

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

        if (valid && username_cookie === username) {
            return res.status(200).json({
                success: true,
                message: 'User data',
                data: {
                    username: username,
                    email: user.email,
                    displayName: user.displayName,
                    email_verified: user.email_verified,
                    role: user.role,
                    avatar_url: user.avatar_url,
                    bio: user.bio
                },
                error: null
            });
        }

        return res.status(200).json({
            success: true,
            message: 'User data',
            data: {
                username: username,
                displayName: user.displayName,
                role: user.role,
                avatar_url: user.avatar_url,
                bio: user.bio
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

    if (!user?.valid || username !== user.username_cookie) {
        return res.status(401).json({
            success: false,
            message: "Not authorized",
            data: null,
            error: {
                code: 401,
                details: "You must be logged in and can only edit your own account"
            }
        });
    }
    const unprocessableErrors = [];
    const id = user.id;
    const { bio, display_name } = req.body;
    let { newUsername, email } = req.body;

    console.log (`===DEBUG===\nusername: ${username}\nid: ${id}\nbio: ${bio}\ndisplay_name: ${display_name}\nnewUsername: ${newUsername}\nemail: ${email}\n===DEBUG===`);

    try {
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
            id: id,
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

        const newToken = jwt.sign(
            {
                id: id,
                username: cleanedUsername,
                role: user.role,
                sessionId: user.session_id_cookie,
            },
            'super_secret_long_random_string',
            { algorithm: 'HS256', expiresIn: '7d' }
        );

        res.cookie('token', newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: "Successfully updated user",
            data: {
                id: id,
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
    console.log('Updating profile picture\n');
    const { user } = req;
    const { avatar_url } = req.body;
    const username = req.params.username;
    if (!user?.valid || username !== user.username_cookie) {
        return res.status(401).json({
            success: false,
            message: "Not authorized",
            data: null,
            error: {
                code: 401,
                details: "You must be logged in and can only edit your own account"
            }
        });
    }

    const id = user.id;

    try {
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

        const result = await updateUserProfilePicture({id, avatar_url});

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

    if (!user?.valid || ( user?.role !== 'admin' || user?.role !== 'moderator') ) {
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
            created: users.created_at,
            updated: users.updated_at
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

// ==== WORKING ON ====
// Soft delete must also work for admin or moderators without token from cookie
const softDelete = async (req, res) => {
    const { user } = req;
    const { username } = req.params;

    if (!user?.valid || username !== user.username_cookie) {
        return res.status(401).json({
            success: false,
            message: "Not authorized",
            data: null,
            error: {
                code: 401,
                details: "You must be logged in and can only delete your own account"
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
        const result = await getAllActiveUsers();
        if (!result || result.length === 0) {return res.status(404).json({ message: 'No active users' });}
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}


// ==== NOT STARTED ====
const changeUserRole = async (req, res) => {}
const permanentDeleteUser = async (req, res) => {}

module.exports = {
    getUserProfile,
    onlineStatus,
    updateProfile,
    allUsers,
    allActiveUsers,
    updateProfilePicture,
    softDelete,
}