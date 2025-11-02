const {isUserOnline} = require("../utils/onlineChecker");
const {lastSeen} = require("../utils/lastSeen");
const { findByIdentifier, createUser, getUserByUsername } = require('../models/userModel');

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

module.exports = {
    getUserProfile,
    onlineStatus,
}