const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { findByIdentifier, createUser, updateUserProfilePicture, verifyUserEmail } = require('../models/userModel');
const { createSession, getAllUsersSession, deleteSession } = require('../models/sessionModel');
const { createOAUTH } = require('../models/oauthAccountModel');
require('dotenv').config();

// CONFIGURATION

/**
 * Configuration options for Argon2 password hashing.
 * These settings are recommended for a secure password hashing implementation.
 */
const ARGON2_OPTS = {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1
};

// HEALTH CHECK

/**
 * Responds with a success message if the authentication route is running.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const healthCheck = (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'The authentication route is running!',
        data: null,
        error: null
    });
};

// STANDARD AUTHENTICATION

/**
 * Handles user login with email/username and password.
 * @param {object} req - Express request object, expecting `identifier` and `password` in the body.
 * @param {object} res - Express response object.
 */
const login = async (req, res) => {
    try {
        let { identifier } = req.body;
        const { password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({ success: false, message: "Missing credentials", data: null, error: { code: 400, details: "Missing credentials." } });
        }

        identifier = identifier.toLowerCase().trim();
        const user = await findByIdentifier(identifier);

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials", data: null, error: { code: 400, details: "Invalid credentials." } });
        }

        const passwordMatches = await argon2.verify(user.hashed_password, password);
        if (!passwordMatches) {
            return res.status(400).json({ success: false, message: "Invalid credentials", data: null, error: { code: 400, details: "Invalid credentials." } });
        }

        const tokenExpiry = '30d';
        const cookieMaxAge = 30 * 24 * 60 * 60 * 1000;

        const userAgent = req.headers['user-agent'];
        const ipAddress = req.ip;
        const expiresAt = new Date(Date.now() + cookieMaxAge);
        const session = await createSession(user.id, userAgent, ipAddress, expiresAt);

        const tokenPayload = { id: user.id, username: user.username, role: user.role, sessionId: session.id };
        const token = jwt.sign(tokenPayload, process.env.SECRET_STRING, {
            algorithm: 'HS256',
            expiresIn: tokenExpiry,
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: cookieMaxAge
        });

        return res.status(200).json({
            success: true,
            message: "Successfully logged in",
            data: { token, user: { id: user.id, username: user.username, email: user.email } },
            error: null
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ success: false, message: "Server error", data: null, error: { code: 500, details: "An internal error occurred." } });
    }
};

/**
 * Handles new user registration.
 * @param {object} req - Express request object, expecting user details in the body.
 * @param {object} res - Express response object.
 */
const register = async (req, res) => {
    let { username, email, firstname, lastname, password } = req.body;

    if (!firstname || !lastname || !username || !email || !password) {
        return res.status(400).json({ success: false, message: "Missing credentials", data: null, error: { code: 400, details: "Please fill out all fields." } });
    }

    // Input validation - return on first error
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(422).json({ success: false, message: "Validation failed", data: null, error: { code: 422, details: "Invalid email format." } });
    }
    if (!/^[A-Za-z0-9_]{4,}$/.test(username)) {
        return res.status(422).json({ success: false, message: "Validation failed", data: null, error: { code: 422, details: "Username must be at least 4 characters." } });
    }
    if (password.length < 8) {
        return res.status(422).json({ success: false, message: "Validation failed", data: null, error: { code: 422, details: "Password must be at least 8 characters." } });
    }
    if (!/[A-Z]/.test(password)) {
        return res.status(422).json({ success: false, message: "Validation failed", data: null, error: { code: 422, details: "Password needs an uppercase letter." } });
    }
    if (!/[a-z]/.test(password)) {
        return res.status(422).json({ success: false, message: "Validation failed", data: null, error: { code: 422, details: "Password needs a lowercase letter." } });
    }
    if (!/\d/.test(password)) {
        return res.status(422).json({ success: false, message: "Validation failed", data: null, error: { code: 422, details: "Password needs a number." } });
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
        return res.status(422).json({ success: false, message: "Validation failed", data: null, error: { code: 422, details: "Password needs a special character." } });
    }

    try {
        username = username.toLowerCase().trim();
        email = email.toLowerCase().trim();
        firstname = (firstname[0].toUpperCase() + firstname.slice(1).toLowerCase()).trim();
        lastname = (lastname[0].toUpperCase() + lastname.slice(1).toLowerCase()).trim();

        const existingUser = await findByIdentifier(username) || await findByIdentifier(email);
        if (existingUser) {
            return res.status(409).json({ success: false, message: "Conflict", data: null, error: { code: 409, details: "Username or email is already taken." } });
        }

        const hashedPassword = await argon2.hash(password, ARGON2_OPTS);
        const newUser = await createUser({ firstname, lastname, username, email, hashedPassword });

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: { id: newUser.id, username: newUser.username, email: newUser.email, firstname: newUser.firstname, lastname: newUser.lastname },
            error: null
        });
    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({ success: false, message: "Server error", data: null, error: { code: 500, details: "An internal error occurred." } });
    }
};

// GOOGLE OAUTH

/**
 * Configures the Google OAuth 2.0 strategy for Passport.
 */
passport.use(
    new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/api/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value?.toLowerCase();
                let username = (profile.displayName || email.split("@")[0]).toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9_]/g, "");
                const user = {
                    username,
                    email,
                    role: "player",
                    avatar_url: profile.photos?.[0]?.value,
                    firstname: profile.name.givenName,
                    lastname: profile.name.familyName,
                    providerId: profile.id,
                    providerName: 'google'
                };
                return done(null, user);
            } catch (err) {
                console.error("OAuth Error:", err);
                done(err, null);
            }
        }
    )
);

/**
 * Initiates the Google OAuth authentication flow.
 */
const google = passport.authenticate("google", { scope: ["profile", "email"] });

/**
 * Handles the callback from Google OAuth.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
const googleCallback = (req, res, next) => {
    passport.authenticate("google", { session: false }, async (error, user) => {
        if (error || !user) {
            return res.status(400).json({ success: false, message: "OAuth failed", data: null, error: { code: 400, details: "Google authentication failed." } });
        }
        try {
            const { email, username: originalUsername, firstname, lastname, avatar_url, providerName, providerId } = user;
            if (!email) return res.status(400).json({ success: false, message: "No email found", data: null, error: { code: 400, details: "Google account has no email." } });

            let userDB = await findByIdentifier(email);
            let username = originalUsername;

            if (!userDB) {
                let checkUsername = await findByIdentifier(username);
                let counter = 1;
                while (checkUsername) {
                    username = `${originalUsername}${counter++}`;
                    checkUsername = await findByIdentifier(username);
                }
                userDB = await createUser({ firstname, lastname, username, email, hashedPassword: null });
            }

            const userAgent = req.headers["user-agent"];
            const ipAddress = req.ip;
            const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            const session = await createSession(userDB.id, userAgent, ipAddress, expiresAt);

            const token = jwt.sign({ id: userDB.id, username: userDB.username, role: userDB.role, sessionId: session.id },
                process.env.SECRET_STRING, { expiresIn: "1d" }
            );

            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Lax",
                maxAge: 24 * 60 * 60 * 1000
            });

            await Promise.all([
                updateUserProfilePicture({ id: userDB.id, avatar_url }),
                verifyUserEmail(userDB.id),
                createOAUTH({ provider: providerName, provider_account_id: providerId, user_id: userDB.id })
            ]);

            return res.redirect('http://localhost:5173/');
        } catch (error) {
            console.error("DB error in Google OAuth:", error);
            return res.status(500).json({ success: false, message: "Server error", data: null, error: { code: 500, details: "An internal error occurred." } });
        }
    })(req, res, next);
};

// SESSION MANAGEMENT

/**
 * Retrieves all active sessions for the authenticated user.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const getAllUsersSessions = async (req, res) => {
    if (!req.user?.valid) {
        return res.status(401).json({ success: false, message: "Unauthorized", data: null, error: { code: 401, details: "Unauthorized." } });
    }
    try {
        const sessions = await getAllUsersSession(req.user.id);
        if (!sessions || sessions.length === 0) {
            return res.status(404).json({ success: false, message: "Not found", data: null, error: { code: 404, details: "No sessions found." } });
        }
        const formattedSessions = sessions.map(s => ({
            session_id: s.id,
            ip_address: s.ip_address,
            device: s.device,
            created_at: s.created_at,
            last_seen_at: s.last_seen_at || null,
        }));
        return res.status(200).json({ success: true, message: "All sessions found", data: { "All Sessions": formattedSessions }, error: null });
    } catch (error) {
        console.error("Get All User Sessions Error:", error);
        return res.status(500).json({ success: false, message: 'Server error', data: null, error: { code: 500, details: "An internal error occurred." } });
    }
};

/**
 * Deletes a specific user session.
 * @param {object} req - Express request object, expecting `session_id` in params.
 * @param {object} res - Express response object.
 */
const deleteUserSession = async (req, res) => {
    const { session_id } = req.params;
    if (!session_id) {
        return res.status(404).json({ success: false, message: "Not found", data: null, error: { code: 404, details: "Missing session ID." } });
    }
    try {
        const result = await deleteSession(session_id);
        if (!result || result.length === 0) {
            return res.status(404).json({ success: false, message: "Not found", data: null, error: { code: 404, details: "Session not found." } });
        }
        return res.status(200).json({ success: true, message: "Session Revoked Successfully", data: null, error: null });
    } catch (error) {
        console.error("Delete User Session Error:", error);
        return res.status(500).json({ success: false, message: "Server error", data: null, error: { code: 500, details: "An internal error occurred." } });
    }
};

// AUTHENTICATION UTILITIES

/**
 * Authenticates a user by verifying their JWT token.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const authenticate = (req, res) => {
    try {
        const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: "Token not found", data: null, error: { code: 401, details: "Token not found." } });
        }
        const decoded = jwt.verify(token, process.env.SECRET_STRING);
        return res.json({ success: true, message: 'Authenticated with JWT token', data: decoded, error: null });
    } catch (err) {
        console.error('Token validation error:', err);
        return res.status(401).json({ success: false, message: 'Invalid token', data: null, error: { code: 401, details: "Invalid or expired token." } });
    }
};

/**
 * Logs out the user by deleting their session and clearing the auth cookie.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const logout = async (req, res) => {
    try {
        const { sessionId } = req.user;
        if (sessionId) {
            await deleteSession(sessionId);
        }
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax'
        });
        return res.status(200).json({ success: true, message: "Successfully logged out", data: null, error: null });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ success: false, message: 'Server error', data: null, error: { code: 500, details: "An internal error occurred." } });
    }
};

module.exports = {
    login,
    register,
    authenticate,
    google,
    googleCallback,
    getAllUsersSessions,
    deleteUserSession,
    healthCheck,
    logout,
};