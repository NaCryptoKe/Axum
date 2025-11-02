const { updateLastSeen } = require('../models/sessionModel');

const updateLastSeenMiddleware = async (req, res, next) => {
    try {
        const sessionId = req.cookies.session_id; // or token decoded session id
        if (sessionId) {
            await updateLastSeen(sessionId);
        }
    } catch (err) {
        console.error('Error updating last seen:', err);
    }
    next();
};

module.exports = updateLastSeenMiddleware;
