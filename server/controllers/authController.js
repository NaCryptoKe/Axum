const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { findByIdentifier, createUser, getUserByUsername } = require('../models/userModel');
const {createSession, getAllUsersSession} = require('../models/sessionModel')

const ARGON2_OPTS = {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1
};
// ✅ Google OAuth setup
passport.use(
    new GoogleStrategy(
        {
            clientID: "736040441877-i5bn5cptbctkd04dkc4a223j690q98uu.apps.googleusercontent.com",
            clientSecret: "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",
            callbackURL: "http://localhost:3000/api/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value?.toLowerCase();
                const username = profile.displayName || email.split("@")[0];
                const avatar_url = profile.photos?.[0]?.value;

                // 👇 Replace with real DB check/create logic
                const user = {
                    id: 1,
                    username,
                    email,
                    role: "user",
                    avatar_url
                };

                return done(null, user);
            } catch (err) {
                console.error("OAuth Error:", err);
                done(err, null);
            }
        }
    )
);
// ======================
// NORMAL AUTH
// ======================
const login = async (req, res) => {
    try {
        let { identifier, password, remember_me } = req.body;

        if (!identifier || !password)
            return res.status(400).json({ message: 'Missing required field' });

        identifier = identifier.toLowerCase().trim();

        const user = await findByIdentifier(identifier);
        if (!user)
            return res.status(401).json({ message: 'Invalid username/email' });

        const passwordMatches = await argon2.verify(user.hashed_password, password);
        if (!passwordMatches)
            return res.status(401).json({ message: 'Incorrect password' });

        // 1️⃣ JWT expiration
        const tokenExpiry = remember_me ? '30d' : '1d';
        const cookieMaxAge = remember_me ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

        // 3️⃣ Store session in DB
        const userAgent = req.headers['user-agent'];
        const ipAddress = req.ip;
        const expiresAt = new Date(Date.now() + cookieMaxAge);

        const session = await createSession(user.id, userAgent, ipAddress, expiresAt);

        // 2️⃣ Sign JWT
        const tokenPayload = { id: user.id, username: user.username, role: user.role, sessionId: session.id };
        const token = jwt.sign(tokenPayload,  'super_secret_long_random_string', {
            algorithm: 'HS256',
            expiresIn: tokenExpiry,
        });

        // 4️⃣ Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: cookieMaxAge
        });

        return res.json({ message: 'Login successful', token,
        user : {
            id: user.id,
            username: user.username,
        }});

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: 'Server error' });
    }
};

const register = async (req, res) => {
    let { username, email, display_name, password } = req.body;

    try {
        username = username.toLowerCase().trim();
        email = email.toLowerCase().trim();

        if (!username || !email || !display_name || !password)
            return res.status(400).json({ error: "Missing required fields" });

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            return res.status(400).json({ error: "Invalid email format" });

        if (!/^[A-Za-z0-9_]{4,}$/.test(username))
            return res.status(400).json({ error: "Invalid username format" });

        if (password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password))
            return res.status(400).json({ error: "Weak password" });

        const existingUser = await findByIdentifier(username) || await findByIdentifier(email);
        if (existingUser)
            return res.status(400).json({ message: 'Username or email already exists' });

        const hashedPassword = await argon2.hash(password, ARGON2_OPTS);
        const newUser = await createUser({ username, email, display_name, hashed_password: hashedPassword });

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ======================
// AUTH UTILITIES
// ======================

const authenticate = (req, res) => {
    try {
        // 1️⃣ Try reading token from cookie first, fallback to header
        const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Not authenticated' });

        // 2️⃣ Verify JWT
        const decoded = jwt.verify(token,  'super_secret_long_random_string');

        res.json({ valid: true, user: decoded });
    } catch (err) {
        console.error('Token validation error:', err);
        res.status(401).json({ valid: false, message: 'Invalid or expired token' });
    }
};

// ======================
// GOOGLE OAUTH
// ======================
const google = passport.authenticate("google", { scope: ["profile", "email"] });

const googleCallback = (req, res, next) => {
    passport.authenticate("google", { session: false }, async (err, profile) => {
        if (err || !profile) {
            console.error("Google OAuth error:", err);
            return res.status(400).json({ message: "OAuth failed or no user found" });
        }

        try {
            const email = profile.emails?.[0]?.value?.toLowerCase();
            const displayName = profile.displayName || "New User";
            if (!email) return res.status(400).json({ message: "Google account has no email" });

            // ✅ Check if user exists
            let user = await findByIdentifier(email);
            let message;

            if (!user) {
                user = await createUser({
                    username: displayName.toLowerCase().replace(/\s+/g, "_"),
                    email,
                    display_name: displayName,
                    hashed_password: null,
                    avatar_url: profile.photos?.[0]?.value || null
                });
                message = "Hello new user 👋";
            } else {
                message = "Welcome back 👀";
            }

            // ✅ Create session for online tracking
            const userAgent = req.headers["user-agent"];
            const ipAddress = req.ip;
            const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 1 day by default
            const session = await createSession(user.id, userAgent, ipAddress, expiresAt);

            // ✅ Generate JWT including sessionId
            const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role, sessionId: session.id },
                "super_secret_long_random_string",
                { expiresIn: "1d" }
            );

            // ✅ Set cookie
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Lax",
                maxAge: 24 * 60 * 60 * 1000
            });

            return res.status(200).json({
                message,
                token,
                user: {
                    username: user.username,
                    email: user.email,
                    display_name: user.display_name,
                    avatar_url: user.avatar_url
                }
            });
        } catch (dbErr) {
            console.error("DB error in Google OAuth:", dbErr);
            return res.status(500).json({ message: "Server error during OAuth" });
        }
    })(req, res, next);
};

const getAllUsersSessions = async (req, res) => {
    const { token } = req.cookies;

    try {
        if (!token) return res.status(401).json({ message: 'No token found' });

        const decoded = jwt.verify(token, 'super_secret_long_random_string');
        const user_id = decoded.id;

        const sessions = await getAllUsersSession(user_id);

        if (!sessions || sessions.length === 0)
            return res.status(404).json({ message: 'No sessions found' });

        // Map each session to a cleaner JSON format
        const formattedSessions = sessions.map(session => ({
            session_id: session.id,
            ip_address: session.ip_address,
            device: session.device,
            created_at: session.created_at,
            last_seen_at: session.last_seen_at || null, // optional if you track last activity
        }));

        return res.status(200).json(formattedSessions);
    } catch (error) {
        console.error("Get All User Sessions Error:", error);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    login,
    register,
    authenticate,
    google,
    googleCallback,
    getAllUsersSessions
};
