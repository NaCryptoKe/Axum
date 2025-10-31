const nodemailer = require('nodemailer');
const { getUserById, getUserByUsername } = require('../models/userModel')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nahomcryptoketema@gmail.com',
        pass: 'kngz emfs azvp gltt '
    }
});

const sendOtpEmail = async (user_id, otp) => {
    try {
        // Fetch user info
        const user = await getUserById(user_id);
        const userDetails = await getUserByUsername(user.username);
        const { email, display_name } = userDetails;
        console.log(`Email sent to ${email}`);
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
        console.log('Beautiful email sent:', info.messageId);
    } catch (err) {
        console.error('Error sending email:', err);
    }
};

module.exports = { sendOtpEmail };