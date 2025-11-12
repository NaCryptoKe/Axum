const jwt = require('jsonwebtoken');

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
        const decoded = jwt.verify(token,  'super_secret_long_random_string');

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
