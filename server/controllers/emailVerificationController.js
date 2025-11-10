const { createEmailVerification, checkOtp } = require('../models/emailVerificationModel');
const { getUserById, verifyUserEmail } = require('../models/userModel');
const { sendOtpEmail } = require('../utils/mailOTP');

/**
 * Generate and send a new OTP for email verification.
 *
 * @async
 * @function generateOtp
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request payload.
 * @param {string} req.body.user_id - The ID of the user to send the OTP to.
 * @param {Object} res - Express response object.
 *
 * @returns {Object} JSON response with possible outcomes:
 *
 * Success (201):
 * {
 * "success": true,
 * "message": "OTP generated and sent successfully.",
 * "data": { "expires_at": "timestamp" },
 * "error": null
 * }
 *
 * Client Errors:
 * - 400 (Bad Request): Missing user_id.
 * - 404 (Not Found): User ID does not exist.
 * - 409 (Conflict): User's email is already verified.
 *
 * Server Error (500):
 * - Database or email service failure.
 */
const generateOtp = async (req, res) => {
    try {
        const { user_id } = req.body;

        // 1. Validation (Bad Request)
        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: 'Bad Request',
                data: null,
                error: {
                    code: 400,
                    details: ['user_id is required']
                }
            });
        }

        // 2. Check user existence (Not Found)
        const user = await getUserById(user_id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
                data: null,
                error: {
                    code: 404,
                    details: 'No user found with the provided user_id.'
                }
            });
        }

        // 3. Check if already verified (Conflict)
        /*if (user.is_verified) { // Assuming your user model has this field
            return res.status(409).json({
                success: false,
                message: 'Account already verified',
                data: null,
                error: {
                    code: 409,
                    details: 'This user account has already been verified.'
                }
            });
        }*/

        // 4. Generate OTP and send email
        const expires_at = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry
        const { otp } = await createEmailVerification(user_id, expires_at);

        //await sendOtpEmail(user.email, otp); // Pass user's email

        // 5. Success Response
        return res.status(201).json({
            success: true,
            message: 'OTP generated and sent successfully.',
            data: {
                expires_at: expires_at.toISOString(),
                otp: otp
            },
            error: null
        });

    } catch (err) {
        console.error("Generate OTP error:", err);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            data: null,
            error: {
                code: 500,
                details: err.message
            }
        });
    }
};

/**
 * Verify a submitted OTP and mark the user's email as verified.
 *
 * @async
 * @function verifyOtp
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request payload.
 * @param {string} req.body.user_id - The user's ID.
 * @param {string} req.body.otp - The 6-digit OTP.
 * @param {Object} res - Express response object.
 *
 * @returns {Object} JSON response with possible outcomes:
 *
 * Success (200):
 * {
 * "success": true,
 * "message": "Email successfully verified.",
 * "data": { "user": { "id": "...", "username": "..." } },
 * "error": null
 * }
 *
 * Client Errors:
 * - 400 (Bad Request): Missing fields or invalid/expired OTP.
 *
 * Server Error (500):
 * - Database failure.
 */
const verifyOtp = async (req, res) => {
    try {
        const { user_id, otp } = req.body;
        const badRequestErrors = [];

        // 1. Validation (Bad Request)
        if (!user_id) badRequestErrors.push('user_id is required');
        if (!otp) badRequestErrors.push('otp is required');

        if (badRequestErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Bad Request',
                data: null,
                error: {
                    code: 400,
                    details: badRequestErrors
                }
            });
        }

        // 2. Verify OTP from model
        const result = await checkOtp(user_id, otp);

        if (!result.success) {
            // Model returned a verification failure (invalid, expired, etc.)
            return res.status(400).json({
                success: false,
                message: result.message, // "Invalid OTP" or "OTP expired"
                data: null,
                error: {
                    code: 400,
                    details: result.message
                }
            });
        }

        // 3. Update user and fetch new data
        await verifyUserEmail(user_id);
        const user = await getUserById(user_id); // Re-fetch user to get updated info

        // 4. Success Response
        return res.status(200).json({
            success: true,
            message: 'Email successfully verified.',
            data: {
                user: {
                    id: user.id,
                    username: user.username
                }
            },
            error: null
        });

    } catch (err) {
        console.error("Submit OTP error:", err);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            data: null,
            error: {
                code: 500,
                details: err.message
            }
        });
    }
};

module.exports = {
    generateOtp,
    verifyOtp
};