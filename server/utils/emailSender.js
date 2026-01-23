const nodemailer = require('nodemailer');
const { getUserById } = require('../models/userModel');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

// Helper for the "Glass" Card Style derived from your CSS
const emailWrapperStyle = `
    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
    background-color: #000; 
    padding: 60px 20px; 
    margin: 0; 
    min-height: 100%;
`;

const cardStyle = `
    max-width: 500px; 
    margin: auto; 
    background: linear-gradient(45deg, rgba(30, 30, 30, 0.9), rgba(60, 60, 60, 0.9));
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 24px; 
    overflow: hidden; 
    color: white;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
`;

const sendOtpEmail = async (user_id, otp) => {
    try {
        const user = await getUserById(user_id);
        if (!user) return;

        const { email, username: display_name } = user;

        const mailOptions = {
            from: '"Axum" <no-reply@axum.com>',
            to: email,
            subject: 'Your Axum Verification Code',
            html: `
            <div style="${emailWrapperStyle}">
                <div style="${cardStyle}">
                    <div style="background-color: rgba(13, 17, 23, 0.5); padding: 30px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <img src="https://i.imgur.com/sEw47O5.png" alt="Axum Logo" style="width: 100px;"/>
                    </div>
                    <div style="padding: 40px; text-align: left;">
                        <h1 style="font-size: 28px; margin: 0 0 20px 0; color: #ffffff; letter-spacing: -0.5px;">Verification</h1>
                        <p style="font-size: 16px; line-height: 1.6; color: rgba(255, 255, 255, 0.8);">Hello <strong>${display_name}</strong>,</p>
                        <p style="font-size: 16px; line-height: 1.6; color: rgba(255, 255, 255, 0.8);">Use the code below to secure your account. It expires in 5 minutes.</p>
                        
                        <div style="margin: 30px 0; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 12px; padding: 20px; text-align: center;">
                            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #ffffff;">${otp}</span>
                        </div>

                        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center;">
                            <p style="font-size: 12px; color: rgba(255,255,255,0.5); margin: 0;">&copy; ${new Date().getFullYear()} Axum Corporation. All rights reserved.</p>
                        </div>
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

const sendPasswordResetLink = async (user_id, passwordResetLink) => {
    try {
        const user = await getUserById(user_id);
        if (!user) return;

        const { email, username: display_name } = user;

        const mailOptions = {
            from: '"Axum" <no-reply@axum.com>',
            to: email,
            subject: 'Axum Password Reset Request',
            html: `
            <div style="${emailWrapperStyle}">
                <div style="${cardStyle}">
                    <div style="background-color: rgba(13, 17, 23, 0.5); padding: 30px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <img src="https://i.imgur.com/sEw47O5.png" alt="Axum Logo" style="width: 100px;"/>
                    </div>
                    <div style="padding: 40px; text-align: left;">
                        <h1 style="font-size: 28px; margin: 0 0 20px 0; color: #ffffff;">Reset Password</h1>
                        <p style="font-size: 16px; line-height: 1.6; color: rgba(255, 255, 255, 0.8);">Hello <strong>${display_name}</strong>,</p>
                        <p style="font-size: 16px; line-height: 1.6; color: rgba(255, 255, 255, 0.8);">We received a request to reset your password. Click the button below to proceed.</p>
                        
                        <div style="margin: 40px 0; text-align: center;">
                            <a href="${passwordResetLink}" style="display: inline-block; background: #ffffff; color: #000000; padding: 14px 30px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 15px rgba(255,255,255,0.2);">Reset Your Password</a>
                        </div>

                        <p style="font-size: 13px; color: rgba(255,255,255,0.5);">If you didn't request this, you can safely ignore this email.</p>
                        
                        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
                            <p style="font-size: 11px; color: rgba(255,255,255,0.4); text-align: center;">Axum Headquarters, 123 Innovation Drive, Tech City</p>
                        </div>
                    </div>
                </div>
            </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Password reset email sent:', info.messageId);
    } catch (err) {
        console.error('Error sending password reset email:', err);
    }
};

module.exports = { sendOtpEmail, sendPasswordResetLink };