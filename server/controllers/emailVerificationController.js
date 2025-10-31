const { createEmailVerification, verifyOtp } = require('../models/emailVerificationModel');
const { sendOtpEmail } = require('../utils/mailOTP');

const { verifyUserEmail, getUserById } = require('../models/userModel');

// Generate and store OTP
const generateOtp = async (req, res) => {
    try {
        const { user_id } = req.body;
        if (!user_id) return res.status(400).json({ message: 'user_id is required' });

        const expires_at = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry
        const { otp } = await createEmailVerification(user_id, expires_at);


        // TODO: send `otp` to user via email/SMS
        console.log(`Generated OTP for user ${user_id}: ${otp}`);
        await sendOtpEmail(user_id, otp);

        return res.status(201).json({ message: 'OTP generated', expires_at, otp });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Verify submitted OTP
const submitOtp = async (req, res) => {
    try {
        const { user_id, otp } = req.body;
        console.log(user_id, otp);
        if (!user_id || !otp) return res.status(400).json({ message: 'user_id and otp are required' });

        const result = await verifyOtp(user_id, otp);

        if (!result.success) {
            return res.status(400).json({ message: result.message });
        }

        await verifyUserEmail(user_id);
        const user = await getUserById(user_id);
        return res.json({
            success: true,
            message: result.message,
            username: user.username
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    generateOtp,
    submitOtp
};
