const { generateNewToken, verifyToken, markUsed, invalidateToken } = require('../models/passwordResetModel');
const { v4: uuidv4 } = require('uuid');
const { randomDelay } = require('../utils/security');
const { sendResetNotification } = require('../utils/notification');
const { getUserById, updatePassword } = require('../models/userModel');
const argon2 = require('argon2');
const ARGON2_OPTS = {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1
};

// ✅ Generate password reset token
const   generatePasswordResetToken = async (req, res) => {
    try {
        const { user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({ message: 'user_id is required' });
        }

        const token = uuidv4();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

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

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ message: 'Token and new password are required' });
        }

        // 1️⃣ Verify token
        const tokenResult = await verifyToken(token);
        if (!tokenResult.valid) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/\d/.test(newPassword)) {
            return res.status(400).json({ message: 'Weak password. Must have 8+ chars, 1 uppercase, 1 number.' });
        }

        const user_id = tokenResult.reset.user_id;

        // 2️⃣ Hash the new password
        const hashedPassword = await argon2.hash(newPassword, ARGON2_OPTS);

        // 3️⃣ Update user's password
        await updatePassword(user_id, hashedPassword);

        // 4️⃣ Mark token as used and/or delete
        await markUsed(token);
        await invalidateToken(token);

        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Reset password error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    generatePasswordResetToken,
    verifyPasswordResetToken,
    resetPassword
};
