const express = require('express');
const {
    login,
    register,
    authenticate, // The "who am I" endpoint
    google,
    googleCallback,
    getAllUsersSessions,
    deleteUserSession,
    healthCheck,
    logout,
} = require('../controllers/authController');

const {
    generateOtp,
    verifyOtp // Renamed from submitOtp to match your file
} = require('../controllers/emailVerificationController');

// --- Middlewares ---
// You may not need these here if they are only used on one route,
// but it's good practice to import them at the top.
const { rateLimiter } = require('../middlewares/rateLimiter');
const { checkCooldown } = require('../middlewares/checkCooldown');
const authenticateMiddleware = require('../middlewares/authenticateMiddleware');

const router = express.Router();

// =================================================================
// 🌎 PUBLIC ROUTES
// =================================================================
// Health check for the auth system
router.get('/', healthCheck);

// =================================================================
// 🔐 AUTHENTICATION
// =================================================================
// --- Standard Auth ---
router.post('/register', register);
router.post('/login', login);

// --- OAuth (Google) ---
router.get("/google", google);
router.get("/google/callback", googleCallback);

// =================================================================
// ✉️ EMAIL VERIFICATION
// =================================================================
// NOTE: Re-add your rateLimiter and checkCooldown when ready
// router.post('/generate-otp', rateLimiter, checkCooldown, generateOtp);
router.post('/generate-otp', generateOtp);
router.post('/verify-otp', verifyOtp);

// =================================================================
// 🛡️ PROTECTED ROUTES
// (All routes below require a valid JWT)
// =================================================================
router.use(authenticateMiddleware);

// --- User & Session Management ---

// Verify token and get user info ("who am I")
// NOTE: This route is protected. It will fail with a 401
// if the middleware fails, which is correct.
router.get('/authenticate', authenticate);

// Get all active sessions for the logged-in user
router.get('/sessions', getAllUsersSessions);

// Delete a specific session (e.g., "log out this device")
router.delete('/sessions/:session_id', deleteUserSession);

// Log out the *current* session
router.post('/logout', logout);

module.exports = router;