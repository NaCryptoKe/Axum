const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const { findByIdentifier, createUser } = require('../models/userModel');

const ARGON2_OPTS = {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1
};

const login = async (req, res) => {
    const { identifier, password } = req.body;

    try {
        if (!identifier || !password) {
            return res.status(400).json({ message: 'Missing required field' });
        }

        const user = await findByIdentifier(identifier);

        if (!user) {
            return res.status(401).json({ message: 'Invalid username/email' });
        }

        // Use the correct field
        const storedPassword = user.hashed_password;

        // Validate password
        const passwordMatches = await argon2.verify(storedPassword, password);
        if (!passwordMatches) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        // JSON Web Token
        const tokenPayload = {
            id: user.id,
            username: user.username,
            role: user.role,
        };

        const token = jwt.sign(tokenPayload, 'super_secret_long_random_string', {
            algorithm: 'HS256',
            expiresIn: '1d'
        });

        // Set HttpOnly cookie
        res.cookie('token', token, {
            httpOnly: false,
            secure: false, // for localhost testing
            sameSite: 'Lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                display_name: user.display_name,
                role: user.role
            }
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: 'Server error' });
    }
};


const register = async (req, res) => {
    const { username, email, display_name, password } = req.body;

    try {
        // Validation
        if (!username || !email || !display_name || !password) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        if (!/^[A-Za-z0-9_]{4,}$/.test(username)) {
            return res.status(400).json({ error: "Username must be at least 4 characters and contain only letters, numbers, or underscores." });
        }

        if (password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password)) {
            return res.status(400).json({ error: "Weak password" });
        }

        // Check for existing user
        const existingUser = await findByIdentifier(username) || await findByIdentifier(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        // Hash password
        const hashedPassword = await argon2.hash(password, ARGON2_OPTS);

        // Create user
        const newUser = await createUser({
            username,
            email,
            display_name,
            hashed_password: hashedPassword
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: newUser
        });

    } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ message: 'Server error' });
    }
};

const authenticate = (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: 'Not authenticated' });

        const decoded = jwt.verify(token, 'super_secret_long_random_string');
        res.json({
            username: decoded.username,
            role: decoded.role
        });
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: 'Invalid token' });
    }
};


module.exports = { login, register, authenticate };
