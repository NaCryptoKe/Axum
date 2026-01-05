const { generateOtp } = require('../controllers/emailVerificationController');

const isVerifiedMiddleware = async (req, res, next) => {
    if (req.user && req.user.valid && !req.user.email_verified) {
        // req.body.user_id = req.user.id; 
        // await generateOtp(req, res);
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
