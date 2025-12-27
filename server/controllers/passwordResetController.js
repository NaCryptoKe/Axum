const { generateNewToken, verifyToken, markUsed, invalidateToken } = require('../models/passwordResetModel');
const { v4: uuidv4 } = require('uuid');
const { randomDelay } = require('../utils/security');
const { sendPasswordResetLink } = require('../utils/emailSender');
const { getUserById, updatePassword, findByIdentifier } = require('../models/userModel');
const argon2 = require('argon2');
const ARGON2_OPTS = {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1
};

/**
 * Generates a password reset token for a user and returns it along with the user's email and token expiration time.
 * Expects `user_id` in the request body.
 * Responds with 201 on success, 400 if user_id is missing, 502 if token generation fails, and 500 on server error.
 */
const generatePasswordResetToken = async (req, res) => {
    try {
        const { identifier } = req.body;

        if (!identifier) {
            return res.status(400).json({
                success: false,
                message: 'Missing identifier',
                data: null,
                error: {
                    code: 400,
                    message: 'Missing user identifier (username)'
                }
            });
        }

        const user = await findByIdentifier(identifier);
        console.log(`user: ${user}`);

        const user_id = user.id;

        const token = uuidv4();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        const result = await generateNewToken(user_id, token, expiresAt);

        if (!result) {
            await randomDelay();
            return res.status(502).json({
                success: false,
                message: 'Bad Gateway',
                data: null,
                error: {
                    code: 502,
                    message: 'Failed to generate a password reset token'
                }
            });
        }

        const { email } = await getUserById(user_id);
        await sendPasswordResetLink(email, token)

        return res.status(201).json({
            success: true,
            message: 'Password reset token generated',
            data: {
                token: token,
                email: email,
                expiresAt: expiresAt,
            },
            error: null
        });
    } catch (error) {
        console.error(error);
        await randomDelay();
        return res.status(500).json({
            success: false,
            message: 'Server error',
            data: null,
            error: {
                code: 500,
                message: 'Server Error',
            }
        });
    }
};


/**
 * Resets the user's password using a valid token.
 * Expects `token` in the request params and `password` in the request body.
 * Performs password strength validation and updates the password if valid.
 * Responds with 200 on success, 400 for missing credentials or invalid token, 422 for unprocessable inputs, and 500 on server error.
 */
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        console.log(token);
        const { password } = req.body;
        const unprocessableErrors = [];

        if (!token || !password) {
            return res.status(400).json({
                success: false,
                message: 'Missing Credentials',
                data: null,
                error: {
                    code: 400,
                    message: 'Missing token and the new password'
                }
            });
        }

        const tokenResult = await verifyToken(token);

        if (!tokenResult.valid) {
            await randomDelay();
            return res.status(400).json({
                success: false,
                message: 'Bad Request',
                data: null,
                error: {
                    code: 400,
                    message: 'Token expired or invalid'
                }
            });
        }

        if (password.length < 8) unprocessableErrors.push ('Password length should be at least 8 characters.');

        if (!/[A-Z]/.test(password)) unprocessableErrors.push ('Password should contain a capital letter.');

        if (!/[a-z]/.test(password)) unprocessableErrors.push('Password should contain a small letter.');

        if (!/[^a-zA-Z0-9]/.test(password)) unprocessableErrors.push ('Password should contain a special character.');

        if (!/\d/.test(password)) unprocessableErrors.push ('Password should contain a number.');

        if (unprocessableErrors.length > 0)
            return res.status(422).json({
                success: false,
                message: "Unprocessable inputs",
                data: null,
                error: {
                    code: 422,
                    details: unprocessableErrors
                }
            });

        const user_id = tokenResult.reset.user_id;

        const hashedPassword = await argon2.hash(password, ARGON2_OPTS);

        await updatePassword(user_id, hashedPassword);

        await markUsed(token);
        await invalidateToken(token);

        return res.status(200).json({
            success: true,
            message: 'Successfully validated token',
            data: {
                detail: 'Successfully updated password',
            },
            error: null
        });
    }  catch (error) {
        console.error(error);
        return res.status(500).json(
            {
                success: false,
                message: 'Server error',
                data: null,
                error: {
                    code: 500,
                    message: 'Internal Server Error',
                }
            });
    }
};

module.exports = {
    generatePasswordResetToken,
    resetPassword
};
