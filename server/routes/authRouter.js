const express = require('express');
const {
    login,
    register,
    authenticate,
    google,
    googleCallback,
    getAllUsersSessions,
    deleteUserSession,
    healthCheck,
    logout,
} = require('../controllers/authController');

const {
    generateOtp,
    verifyOtp
} = require('../controllers/emailVerificationController');

const { rateLimiter } = require('../middlewares/rateLimiter');
const { checkCooldown } = require('../middlewares/checkCooldown');
const authenticateMiddleware = require('../middlewares/authenticateMiddleware');

const router = express.Router();

router.get('/health', healthCheck);

// Basic Authentication Routes
router.post('/register', register);
router.post('/login', login);

// Google OAuth Routes
router.get("/google", google);
router.get("/google/callback", googleCallback);

// OTP (One-Time Password) Routes
router.post('/generate-otp', rateLimiter, checkCooldown, generateOtp);
router.post('/verify-otp', verifyOtp);

router.use(authenticateMiddleware); // Middleware to authenticate all routes below this line

// Authenticated User Routes
router.get('/authenticate', authenticate);
router.get('/sessions', getAllUsersSessions);
router.delete('/sessions/:session_id', deleteUserSession);
router.post('/logout', logout);

module.exports = router;