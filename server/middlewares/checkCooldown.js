// Used for limiting a user from spamming the server
require('dotenv').config();
const { getEmailVerification, createEmailVerification } = require('../models/emailVerificationModel');

const RESEND_COOLDOWN_MS = process.env.COOLDOWN_MS; // 60 seconds

const checkCooldown = async (req, res, next) => {
    const { user_id } = req.body;
    if (!user_id) return res.status(400).json({ message: "Missing user_id" });

    const record = await getEmailVerification(user_id);
    if (record) {
        const now = new Date();
        const lastRequest = new Date(record.updated_at || record.created_at);
        const diff = now - lastRequest;

        if (diff < RESEND_COOLDOWN_MS) {
            return res.status(429).json({ message: `Please wait ${Math.ceil((RESEND_COOLDOWN_MS - diff) / 1000)}s before requesting a new OTP.` });
        }
    }

    next();
};

module.exports = { checkCooldown };
