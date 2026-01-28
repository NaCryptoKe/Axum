const jwt = require('jsonwebtoken');
const { getUserById } = require('../models/userModel');
const { getSessionById } = require('../models/sessionModel')
require('dotenv').config();

const authenticateMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];
        if (!token) {
            req.user = { valid: false };
            return next();
        }

        const decoded = jwt.verify(token, process.env.SECRET_STRING);
        const validSession = await getSessionById(decoded.sessionId);
        if (!validSession) {
            req.user = { valid: false };
            return next();
        }
        const user = await getUserById(decoded.id);

        if (!user) {
            req.user = { valid: false };
            return next();
        }

        req.user = {
            ...user,
            valid: true,
            id: decoded.id,
            role: decoded.role,
            username_cookie: decoded.username,
            session_id_cookie: decoded.sessionId,
        };

        next();
    } catch (err) {
        console.error('Token validation error:', err);
        req.user = { valid: false };
        next();
    }
};

module.exports = authenticateMiddleware;
