const nodemailer = require('nodemailer');
const { getUserById } = require('../models/userModel');
require('dotenv').config();

// =================================================================================================
// EMAIL TRANSPORTER CONFIGURATION
// =================================================================================================

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

// =================================================================================================
// OTP EMAIL SENDER
// =================================================================================================

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
            from: '"AxumArcade" <no-reply@axumarcade.com>',
            to: email,
            subject: 'Your AxumArcade OTP Code 🔒',
            text: `Hello ${display_name},\nYour OTP is: ${otp}\nIt expires in 5 minutes.`,
            html: `
                <div style="
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: auto;
                    padding: 20px;
                    border: 1px solid #eee;
                    border-radius: 10px;
                    text-align: center;
                    background-color: #f9f9f9;
                ">
                    <img src="https://cdn.example.com/logo.png" alt="AxumArcade" style="width:120px; margin-bottom:20px;" />
                    <h2 style="color: #333;">Hello ${display_name}!</h2>
                    <p style="font-size: 16px; color: #555;">
                        Your one-time password (OTP) for AxumArcade is:
                    </p>
                    <p style="
                        font-size: 24px;
                        font-weight: bold;
                        color: #1e88e5;
                        background: #e3f2fd;
                        display: inline-block;
                        padding: 10px 20px;
                        border-radius: 8px;
                        margin: 20px 0;
                    ">${otp}</p>
                    <p style="font-size: 14px; color: #999;">
                        This OTP expires in 5 minutes. Do not share it with anyone.
                    </p>
                    <hr style="border:none; border-top:1px solid #eee; margin:20px 0;" />
                    <p style="font-size: 12px; color: #bbb;">
                        AxumArcade Team | <a href="https://axumarcade.wuaze.com" style="color:#1e88e5; text-decoration:none;">Visit our site</a>
                    </p>
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
