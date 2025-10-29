// middlewares/rateLimiter.js
// Used for limiting a certain ip from spamming the server
const rateLimit = require('express-rate-limit');

const otpResendLimiter = rateLimit({
    windowMs: 60 * 1000, // 60 seconds
    max: 1,               // 1 request per window per IP
    message: {
        message: "You can only request a new OTP once every 60 seconds."
    },
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false,  // Disable `X-RateLimit-*` headers
});

module.exports = { otpResendLimiter };