const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateMiddleware = (req, res, next) => {
    try {
        // Try reading token from cookie first, fallback to header
        const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1]; // Checks token existence and authorization header
        if (!token)  {
            req.user = {
                valid: false,
                id: null,
                username_cookie: null,
                session_id_cookie: null,
            };
            return next();
        }

        // Verify JWT
        const decoded = jwt.verify(token,  process.env.SECRET_STRING);

        req.user = {
            valid: true,
            id: decoded.id,
            role: decoded.role,
            username_cookie: decoded.username,
            session_id_cookie: decoded.sessionId,
        };

        next();
    } catch (err) {
        console.error('Token validation error:', err);

        req.user = {
            valid: false,
            id: null,
            username_cookie: null,
            session_id_cookie: null,
        };
        next();
    }
};

module.exports = authenticateMiddleware;
