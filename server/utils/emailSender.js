const nodemailer = require('nodemailer');
const { getUserById } = require('../models/userModel');
require('dotenv').config();

// EMAIL TRANSPORTER CONFIGURATION

/**
 * Configures the Nodemailer transporter for sending emails.
 * Uses Gmail service with authentication details from environment variables.
 * It's crucial to set MAIL_USER and MAIL_PASS in your .env file.
 */
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER, // Your Gmail address from .env
        pass: process.env.MAIL_PASS  // Your Gmail app password or actual password from .env
    }
});

// OTP EMAIL SENDER

/**
 * Sends a One-Time Password (OTP) email to a specified user.
 * Fetches user details by user ID and constructs an email with the OTP.
 * @param {string} user_id - The ID of the user to whom the OTP should be sent.
 * @param {string} otp - The One-Time Password to be sent.
 */
const sendOtpEmail = async (user_id, otp) => {
    try {
        // Fetch user info. The previous implementation had a redundant fetch.
        const user = await getUserById(user_id);
        if (!user) {
            console.error(`User with ID ${user_id} not found. Cannot send OTP email.`);
            return;
        }

        const { email, username: display_name } = user; // Use username as display_name, or adjust as needed

        // Prepare the email
        const mailOptions = {
            from: '"Axum" <no-reply@axum.com>',
            to: email,
            subject: 'Your Axum Verification Code',
            text: `Hello ${display_name},\n\nYour verification code is: ${otp}\n\nThis code is valid for 5 minutes. If you did not request this, please ignore this email.\n\nThanks,\nThe Axum Team`,
            html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; padding: 20px; color: #333;">
                <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                    <div style="background-color: #0d1117; padding: 20px; text-align: center;">
                        <img src="https://i.imgur.com/sEw47O5.png" alt="Axum Logo" style="width: 120px;"/>
                    </div>
                    <div style="padding: 30px 40px; text-align: center;">
                        <h1 style="color: #0d1117; margin-top: 0;">Verification Code</h1>
                        <p style="font-size: 16px;">Hello, <strong>${display_name}</strong>!</p>
                        <p style="font-size: 16px;">Please use the following verification code to complete your action. This code is valid for 5 minutes.</p>
                        <div style="background-color: #f0f0f0; border-radius: 8px; padding: 15px 20px; margin: 30px auto; display: inline-block;">
                            <p style="color: #0d1117; font-size: 28px; font-weight: bold; letter-spacing: 4px; margin: 0;">${otp}</p>
                        </div>
                        <p style="font-size: 14px; color: #777;">If you did not request this code, you can safely ignore this email. Your account is secure.</p>
                    </div>
                    <div style="background-color: #f4f4f4; padding: 20px 40px; font-size: 12px; color: #777; text-align: center;">
                        <p style="margin: 0;">&copy; ${new Date().getFullYear()} Axum Corporation. All rights reserved.</p>
                        <p style="margin: 5px 0 0 0;">Axum Headquarters, 123 Innovation Drive, Tech City, 98765</p>
                        <p style="margin: 10px 0 0 0;">
                            <a href="#" style="color: #0d1117; text-decoration: none;">Privacy Policy</a> &bull;
                            <a href="#" style="color: #0d1117; text-decoration: none;">Terms of Service</a> &bull;
                            <a href="#" style="color: #0d1117; text-decoration: none;">Contact Support</a>
                        </p>
                    </div>
                </div>
            </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('OTP email sent:', info.messageId);
    } catch (err) {
        console.error('Error sending OTP email:', err);
    }
};

module.exports = { sendOtpEmail };
