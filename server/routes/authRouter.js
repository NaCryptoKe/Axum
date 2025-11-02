const express = require('express');
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');

const {
    login,
    register,
    authenticate,
    google,
    googleCallback
} = require('../controllers/authController');

const {
    generateOtp,
    submitOtp
} = require('../controllers/emailVerificationController');

const { rateLimiter } = require('../middlewares/rateLimiter');
const { checkCooldown } = require('../middlewares/checkCooldown');

const router = express.Router();

// ✅ Routes
router.get('/', (req, res) => {
    res.send('API AUTH');
});

// --- GOOGLE OAUTH ---
router.get( "/google", google );
router.get( "/google/callback", googleCallback );

// --- NORMAL AUTH ---
router.post('/login', login);
router.post('/register', register);
router.get('/authenticate', authenticate);

// --- EMAIL VERIFICATION ---
router.post('/generate_otp', rateLimiter, checkCooldown, generateOtp);
router.post('/verify_otp', submitOtp);

// Logout route example
router.post('/logout', (req, res) => {
    const token = req.cookies.token;
    // 1️⃣ Clear the cookie
    res.clearCookie('token', {
        httpOnly: false, // same as when you set it
        secure: false,   // same as when you set it
        sameSite: 'Lax'
    });

    // 2️⃣ Optionally remove server-side session if you track sessions
    // await deleteSession(user_id);

    res.json({ message: 'Logged out, cookie removed',
    token: token});
});

module.exports = router;
