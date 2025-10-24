const userModel = require('../models/userModel');

// =========================== BASIC CRUD ===============================
exports.getAllUsers = async (req, res) => {
    try {
        const users = await userModel.getAllUsers();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

exports.getUserByUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await userModel.getUserByUsername(username);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.getUserById(id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { username, email, displayName, password } = req.body;
        if (!username || !email || !password)
            return res.status(400).json({ error: 'Missing required fields' });

        const existingUser = await userModel.getUserByEmail(email);
        if (existingUser)
            return res.status(400).json({ error: 'Email already in use' });

        const newUser = await userModel.createUser({
            username,
            email,
            displayName,
            password,
        });

        res.status(201).json(newUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create user' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await userModel.updateUser(id, req.body);
        if (!updated) return res.status(404).json({ error: 'User not found' });
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update user' });
    }
};

exports.softDeleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await userModel.softDelete(id);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to soft delete user' });
    }
};

exports.restoreUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await userModel.restoreUser(id);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to restore user' });
    }
};

exports.hardDeleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await userModel.hardDelete(id);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to permanently delete user' });
    }
};

// =========================== AUTHENTICATION ===============================

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.getUserByEmail(email);
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const valid = await userModel.verifyPassword(password, user.hashed_password);
        if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

        const session = await userModel.createSession(
            user.id,
            req.ip,
            req.headers['user-agent']
        );

        res.json({ message: 'Login successful', user, session });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed' });
    }
};

exports.logout = async (req, res) => {
    try {
        const { sessionId } = req.body;
        await userModel.deleteSession(sessionId);
        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Logout failed' });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { oldPassword, newPassword } = req.body;

        const user = await userModel.getUserById(id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const valid = await userModel.verifyPassword(oldPassword, user.hashed_password);
        if (!valid) return res.status(403).json({ error: 'Incorrect old password' });

        const updated = await userModel.changePassword(id, newPassword);
        res.json({ message: 'Password changed successfully', user: updated });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to change password' });
    }
};

// =========================== FOLLOW SYSTEM ===============================

exports.followUser = async (req, res) => {
    try {
        const followerId = req.user?.id || req.body.followerId;
        const { followedId } = req.body;
        const result = await userModel.followUser(followerId, followedId);
        res.json(result || { message: 'Already following or user not found' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to follow user' });
    }
};

exports.unfollowUser = async (req, res) => {
    try {
        const followerId = req.user?.id || req.body.followerId;
        const { followedId } = req.body;
        const result = await userModel.unfollowUser(followerId, followedId);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to unfollow user' });
    }
};

exports.getFollowers = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await userModel.getFollowers(id);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch followers' });
    }
};

exports.getFollowing = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await userModel.getFollowing(id);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch following list' });
    }
};

// =========================== MODERATION ===============================

exports.banUser = async (req, res) => {
    try {
        const { userId, reason, duration } = req.body;
        const result = await userModel.banUser(userId, reason, duration);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to ban user' });
    }
};

exports.unbanUser = async (req, res) => {
    try {
        const { userId } = req.body;
        const result = await userModel.unbanUser(userId);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to unban user' });
    }
};

exports.getBannedUsers = async (req, res) => {
    try {
        const result = await userModel.getBannedUsers();
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch banned users' });
    }
};
