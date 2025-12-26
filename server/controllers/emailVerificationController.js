const { createEmailVerification, checkOtp } = require('../models/emailVerificationModel');
const { getUserById, verifyUserEmail, getUserByUsername } = require('../models/userModel');
const { sendOtpEmail } = require('../utils/mailOTP');
const jwt = require("jsonwebtoken");
const { createSession } = require("../models/sessionModel");
require('dotenv').config();

// OTP GENERATION

/**
 * Generates and sends a One-Time Password (OTP) for email verification.
 * Ensures the user exists and their email is not already verified before sending.
 * @param {object} req - Express request object, containing `user_id` in the body.
 * @param {object} res - Express response object.
 * @returns {object} JSON response indicating success or failure of OTP generation and sending.
 */
const generateOtp = async (req, res) => {
    try {
        const { user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({ success: false, message: 'Bad Request', error: { details: ['user_id is required'] } });
        }

        const user = await getUserById(user_id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found', error: { details: 'No user found with the provided user_id.' } });
        }

        if (user.is_verified) {
            return res.status(409).json({ success: false, message: 'Account already verified', error: { details: 'This user account has already been verified.' } });
        }

        const expires_at = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry
        const { otp } = await createEmailVerification(user_id, expires_at);

        await sendOtpEmail(user_id, otp); // Pass user's ID
        // console.log(otp); // For testing purposes, should be removed in production

        return res.status(201).json({ success: true, message: 'OTP generated and sent successfully.', data: { expires_at: expires_at.toISOString() } });

    } catch (err) {
        console.error("Generate OTP error:", err);
        return res.status(500).json({ success: false, message: 'Server error', error: { details: err.message } });
    }
};

// OTP VERIFICATION

/**
 * Verifies a submitted OTP and marks the user's email as verified if valid.
 * Also handles session creation and JWT token issuance upon successful verification.
 * @param {object} req - Express request object, containing `user_id` and `otp` in the body.
 * @param {object} res - Express response object.
 * @returns {object} JSON response indicating success or failure of OTP verification.
 */
const verifyOtp = async (req, res) => {
    try {
        const { user_id, otp } = req.body;
        const badRequestErrors = [];

        if (!user_id) badRequestErrors.push('user_id is required');
        if (!otp) badRequestErrors.push('otp is required');

        if (badRequestErrors.length > 0) {
            return res.status(400).json({ success: false, message: 'Bad Request', error: { details: badRequestErrors } });
        }

        const result = await checkOtp(user_id, otp);

        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message, error: { details: result.message } });
        }

        await verifyUserEmail(user_id);
        const user = await getUserById(user_id);

        const tokenExpiry = '30d';
        const cookieMaxAge = 30 * 24 * 60 * 60 * 1000 ; // A month long (30 days)

        const userAgent = req.headers['user-agent'];
        const ipAddress = req.ip;
        const expiresAt = new Date(Date.now() + cookieMaxAge);

        const session = await createSession(user.id, userAgent, ipAddress, expiresAt);

        const tokenPayload = { id: user.id, username: user.username, role: user.role, sessionId: session.id };
        const token = jwt.sign(tokenPayload, process.env.SECRET_STRING, {
            algorithm: 'HS256',
            expiresIn: tokenExpiry,
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: cookieMaxAge
        });

        return res.status(200).json({ success: true, message: 'Email successfully verified.', data: { user: { id: user.id, username: user.username } } });

    } catch (err) {
        console.error("Submit OTP error:", err);
        return res.status(500).json({ success: false, message: 'Server error', error: { details: err.message } });
    }
};

module.exports = {
    generateOtp,
    verifyOtp
};
