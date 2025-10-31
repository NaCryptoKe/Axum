const { generateNewToken, verifyToken, markUsed, invalidateToken } = require('../models/passwordResetModel');
const { v4: uuidv4 } = require('uuid');
const { randomDelay } = require('../utils/security');
const { sendResetNotification } = require('../utils/notification');
const { getUserById } = require('../models/userModel');
// ✅ Generate password reset token
const generatePasswordResetToken = async (req, res) => {
    try {
        const { user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({ message: 'user_id is required' });
        }

        const token = uuidv4();
        const expiresAt = new Date(Date.now() + 5 * 1000); // 5 minutes

        const result = await generateNewToken(user_id, token, expiresAt);

        console.log(`${user_id}\n ${token}\n ${expiresAt}\n`);
        console.log(result);

        if (!result) {
            return res.status(400).json({ message: 'Could not generate token' });
        }

        const { email } = await getUserById(user_id);
        await sendResetNotification(email, token)

        return res.status(201).json({
            message: 'Password reset token generated',
            token,
            expiresAt,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// ✅ Verify password reset token
const verifyPasswordResetToken = async (req, res) => {
    await randomDelay();
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }

        const result = await verifyToken(token);

        if (!result || !result.valid) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Mark token as used so it can't be reused
        await markUsed(token);
        await invalidateToken(token);

        return res.status(200).json({
            message: 'Token verified successfully',
            user_id: result.user_id,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    generatePasswordResetToken,
    verifyPasswordResetToken,
};
