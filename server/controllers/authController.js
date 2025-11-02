const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { findByIdentifier, createUser, getUserByUsername } = require('../models/userModel');
const {createSession} = require('../models/sessionModel')

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
        let { identifier, password, rememberMe } = req.body;

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
        const tokenExpiry = rememberMe ? '30d' : '1d';
        const cookieMaxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

        // 2️⃣ Sign JWT
        const tokenPayload = { id: user.id, username: user.username, role: user.role };
        const token = jwt.sign(tokenPayload,  'super_secret_long_random_string', {
            algorithm: 'HS256',
            expiresIn: tokenExpiry
        });

        // 3️⃣ Store session in DB
        const userAgent = req.headers['user-agent'];
        const ipAddress = req.ip;
        const expiresAt = new Date(Date.now() + cookieMaxAge);

        await createSession(user.id, userAgent, ipAddress, expiresAt);

        // 4️⃣ Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: cookieMaxAge
        });

        res.json({ message: 'Login successful', token,
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
    passport.authenticate("google", { session: false }, async (err, user) => {
        if (err || !user) {
            console.error("Google callback error:", err);
            return res.status(400).json({ message: "OAuth failed or no user found" });
        }

        try {
            // Check if the user already exists in your DB
            const existingUser = await findByIdentifier(user.email);

            let savedUser = existingUser;
            let message;

            if (!existingUser) {
                // Create a new one
                savedUser = await createUser({
                    username: user.username.toLowerCase().trim(),
                    email: user.email.toLowerCase().trim(),
                    display_name: user.username,
                    hashed_password: null, // OAuth user
                    avatar_url: user.avatar_url || null
                });
                message = "Hello new user 👋";
            } else {
                message = "Welcome back 👀";
            }

            // Generate token
            const token = jwt.sign(
                { id: savedUser.id, username: savedUser.username, role: savedUser.role },
                "super_secret_long_random_string",
                { expiresIn: "1d" }
            );

            res.cookie("token", token, {
                httpOnly: false,
                secure: false,
                sameSite: "Lax",
                maxAge: 24 * 60 * 60 * 1000,
            });

            return res.status(200).json({
                message,
                token,
                user: {
                    username: savedUser.username,
                    email: savedUser.email,
                    display_name: savedUser.display_name,
                    avatar_url: savedUser.avatar_url,
                },
            });
        } catch (dbErr) {
            console.error("DB error in OAuth:", dbErr);
            return res.status(500).json({ message: "Server error during OAuth" });
        }
    })(req, res, next);
};

module.exports = {
    login,
    register,
    authenticate,
    google,
    googleCallback
};
