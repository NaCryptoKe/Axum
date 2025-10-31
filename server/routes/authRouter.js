const express = require('express');
const { login, register, authenticate, getUserProfile } = require('../controllers/authController');
const { generateOtp, submitOtp } = require('../controllers/emailVerificationController');

const { rateLimiter } = require('../middlewares/rateLimiter');
const { checkCooldown } = require('../middlewares/checkCooldown');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/profile', authenticate);
// Generate a new OTP for a user
router.post('/generate_otp', rateLimiter, checkCooldown, generateOtp);

// Submit/verify an OTP
router.post('/verify_otp', submitOtp);
router.get('/profile/@:username', getUserProfile);


module.exports = router;
