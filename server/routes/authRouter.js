const express = require('express');
const { login, register, authenticate } = require('../controllers/authController');
const { generateOtp, submitOtp } = require('../controllers/emailVerificationController');

const { otpResendLimiter } = require('../middlewares/rateLimiter');
const { checkOtpCooldown } = require('../middlewares/checkOtpCooldown');
const db = require('../config/db');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/profile', authenticate);
// Generate a new OTP for a user
router.post('/generate_otp', otpResendLimiter, checkOtpCooldown, generateOtp);

// Submit/verify an OTP
router.post('/verify_otp', submitOtp);
router.get('/profile/@:username', async (req, res) => {
    try {
        const { username } = req.params;
        console.log(req.username);
        const user = await db.query('SELECT username, email, display_name, role FROM core.users WHERE username = $1', [username]);

        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
