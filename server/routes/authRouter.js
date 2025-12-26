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

router.get('/', healthCheck); // API health check endpoint

router.post('/register', register); // User registration endpoint
router.post('/login', login); // User login endpoint

router.get("/google", google); // Initiates Google OAuth login flow
router.get("/google/callback", googleCallback); // Handles Google OAuth callback

router.post('/generate-otp', rateLimiter, checkCooldown, generateOtp); // Generates a One-Time Password (OTP) with rate limiting and cooldown
router.post('/verify-otp', verifyOtp); // Verifies the provided OTP

router.use(authenticateMiddleware); // Middleware to authenticate all routes below this line

router.get('/authenticate', authenticate); // Authenticates the user based on the session
router.get('/sessions', getAllUsersSessions); // Retrieves all active user sessions
router.delete('/sessions/:session_id', deleteUserSession); // Deletes a specific user session by ID

router.post('/logout', logout); // Logs out the current user

module.exports = router;