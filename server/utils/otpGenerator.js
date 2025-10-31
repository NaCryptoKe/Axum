const crypto = require('crypto');

function generateOTP() {
    // Generate a random number between 0 and 999999
    const otp = crypto.randomInt(0, 1000000);
    // Pad it with leading zeros if necessary
    return otp.toString().padStart(6, '0');
}


function hashOTP (otp) {
    return crypto.createHash('sha256').update(otp).digest('hex');
}

function generateHashedOTP() {
    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);
    return { otp, hashedOTP };
}

const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

module.exports = { generateHashedOTP, hashOTP };


