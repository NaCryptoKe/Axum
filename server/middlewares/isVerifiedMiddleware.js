const { generateOtp } = require('../controllers/emailVerificationController');
const { isEmailVerified } = require('../models/userModel');

const isVerifiedMiddleware = async (req, res, next) => {
    // Check if user is logged in and valid
    if (!req.user || !req.user.valid) {
        return next(); // If not logged in or invalid, proceed (authentication middleware should handle this)
    }

    // Check email verification status from the database
    const userEmailVerified = await isEmailVerified(req.user.username || req.user.email);

    if (!userEmailVerified) {
        // req.body.user_id = req.user.id; 
        // await generateOtp(req, res); // This should be called carefully, maybe not on every request

        return res.status(403).json({
            success: false,
            message: 'Email not verified. An OTP has been sent to your email.',
            error: {
                code: 403,
                details: 'Email not verified.'
            }
        });
    }
    next();
};

module.exports = isVerifiedMiddleware;
