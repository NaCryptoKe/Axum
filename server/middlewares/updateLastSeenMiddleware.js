const { updateLastSeen } = require('../models/sessionModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const updateLastSeenMiddleware = async (req, res, next) => {
    try {
        // 1️⃣ Read token from cookie (or fallback to Authorization header)
        const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];
        if (!token) return next(); // no token, skip

        // 2️⃣ Verify and decode JWT
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_STRING); // must match login secret
        } catch (err) {
            console.warn('Invalid or expired token for last seen update');
            return next();
        }

        // 3️⃣ Update last_seen_at in sessions table
        if (decoded.sessionId) {
            await updateLastSeen(decoded.sessionId);
        }
    } catch (err) {
        console.error('Error updating last seen:', err);
    }

    // 4️⃣ Continue to next middleware or route handler
    next();
};

module.exports = updateLastSeenMiddleware;
