const { createSession } = require('../models/sessionModel');

const newSession = async (req, res) => {
    const { user_id, user_agent, ip_address } = req.body;

    try {
        if (!user_id) return res.status(400).json({ message: 'User ID is required' });
        if (!user_agent) return res.status(400).json({ message: 'User Agent is required' });
        if (!ip_address) return res.status(400).json({ message: 'IP address is required' });

        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
        const session = await createSession(user_id, user_agent, ip_address, expiresAt);

        return res.status(201).json({ message: 'Session created', session });
    } catch (error) {
        return res.status(500).json({ message: 'Server Error', error });
    }
}

module.exports = { newSession };
