const pool = require('../config/db');
const { generateHashedOTP, hashOTP } = require('../otpGenerator');

// Create a new OTP record
const createEmailVerification = async (user_id, expires_at) => {
    const { otp, hashedOTP } = generateHashedOTP(); // generate new OTP
    const result = await pool.query(
        `INSERT INTO core.email_verifications (user_id, otp_hash, expires_at)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id) 
         DO UPDATE SET otp_hash = EXCLUDED.otp_hash, expires_at = EXCLUDED.expires_at, attempts = 0
         RETURNING *`,
        [user_id, hashedOTP, expires_at]
    );

    return { dbRecord: result.rows[0], otp }; // return plain OTP so you can send it via email
};

// Update attempt count
const incrementVerificationAttempts = async (user_id) => {
    const result = await pool.query(
        `UPDATE core.email_verifications
         SET attempts = attempts + 1
         WHERE user_id = $1
             RETURNING attempts`,
        [user_id]
    );
    return result.rows[0];
};

// Fetch verification by user_id
const getEmailVerification = async (user_id) => {
    const result = await pool.query(
        `SELECT * FROM core.email_verifications WHERE user_id = $1`,
        [user_id]
    );
    return result.rows[0];
};

// Verify OTP
const verifyOtp = async (user_id, submittedOtp) => {
    const record = await getEmailVerification(user_id);

    if (!record) {
        return { success: false, message: 'No OTP found for this user' };
    }

    // Check expiration
    if (new Date() > new Date(record.expires_at)) {
        return { success: false, message: 'OTP has expired' };
    }

    // Check max attempts
    if (record.attempts >= 5) {
        return { success: false, message: 'Maximum verification attempts exceeded' };
    }

    // Verify OTP by hashing and comparing
    const hashedSubmittedOtp = hashOTP(submittedOtp);
    if (hashedSubmittedOtp !== record.otp_hash) {
        await incrementVerificationAttempts(user_id);
        return { success: false, message: 'Invalid OTP' };
    }

    // OTP is valid, delete from DB
    await pool.query(`DELETE FROM core.email_verifications WHERE user_id = $1`, [user_id]);

    return { success: true, message: 'OTP verified successfully' };
};

module.exports = {
    createEmailVerification,
    incrementVerificationAttempts,
    getEmailVerification,
    verifyOtp
};
