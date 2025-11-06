const {lastSeen, isUserOnline} = require("../models/lastSeenModel");
const { updateUserProfile, createUser, getUserByUsername, getAllUsers, getAllActiveUsers, softDeleteUser} = require('../models/userModel');
const jwt = require("jsonwebtoken");

const getUserProfile = async (req, res) => {
    const { username } = req.params;
    console.log('Fetching profile for:', username);

    try {
        const user = await getUserByUsername(username);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const softDelete = async (req, res) => {
    const { username } = req.params;

    try {
        if (!username) return res.status(400).json({ message: 'Username required' });
        const result = await softDeleteUser(username);

        if (!result) return res.status(400).json({ message: 'User not found' });

        return res.status(200).json({ message: 'Successfully soft-deleted',
        deleted: true});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error',
        user: {
            username: result.username,
            is_deleted: result.is_deleted,
            deleted_at: result.deleted_at
        }});
    }
}

const onlineStatus = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await getUserByUsername(username);

        if (!user || user.error) {
            return res.status(404).json({ message: 'User not found' });
        }

        const online = await isUserOnline(user.id);
        const lastSeenAt = await lastSeen(user.id);

        res.json({ username, online, lastSeenAt });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { username } = req.params; // from URL
        const { new_username, email, bio, display_name } = req.body; // from frontend
        const { token } = req.cookies;

        console.log('Fetching profile for:', username);
        console.log(`email: ${email}\nbio: ${bio}\ndisplay_name: ${display_name}\ntoken: ${token}`);

        if (!token) return res.status(401).json({ message: 'Missing token' });

        const decoded = jwt.verify(token, 'super_secret_long_random_string');
        const user_id = decoded.id;

        // Check ownership
        if (decoded.username !== username)
            return res.status(401).json({ message: 'Unauthorized user' });

        // Validate input
        if (!new_username || !email || !bio || !display_name)
            return res.status(400).json({ message: 'Full info required' });

        const cleanedUsername = new_username.toLowerCase().trim();
        const cleanedEmail = email.toLowerCase().trim();

        // Update user
        const result = await updateUserProfile({
            id: user_id,
            username: cleanedUsername,
            email: cleanedEmail,
            bio,
            display_name,
        });

        if (!result)
            return res.status(400).json({ message: 'Profile not updated' });

        // Create a new token (expiresIn should be a duration, not the old exp timestamp)
        const newToken = jwt.sign(
            {
                id: user_id,
                username: cleanedUsername,
                role: decoded.role,
                sessionId: decoded.sessionId,
            },
            'super_secret_long_random_string',
            { algorithm: 'HS256', expiresIn: '7d' } // <-- fixed this line
        );

        // Send new token cookie
        res.cookie('token', newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
        });

        return res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Update Profile Error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};


const updateProfilePicture = async (req, res) => {
    const { token } = req.cookies;
    const { avatar_url } = req.body;

    try {
        if (!token) return res.status(401).json({ message: 'Token not found' });
        if (!avatar_url) return res.status(400).json({ message: 'Avatar URL needed' });

        const decoded = jwt.verify(token,  'super_secret_long_random_string');

        const result = await updateUserProfilePicture({id: decoded.id, avatar_url});

        if (!result) return res.status(400).json({ message: 'Profile picture updated successfully' });

        return res.status(200).json({ message: 'Profile picture updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const allUsers = async (req, res) => {
    try {
        const result = await getAllUsers();
        if (!result || result.length === 0) {return res.status(404).json({ message: 'No users found' });}
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
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

module.exports = {
    getUserProfile,
    onlineStatus,
    updateProfile,
    allUsers,
    allActiveUsers,
    updateProfilePicture,
    softDelete,
}