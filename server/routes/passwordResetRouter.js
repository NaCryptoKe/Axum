const express = require('express');
const { rateLimiter } = require('../middlewares/rateLimiter');
const { checkCooldown } = require('../middlewares/checkCooldown');


const { successResponse } = require('../utils/responseHandler');
const { generatePasswordResetToken, resetPassword} = require ('../controllers/passwordResetController')
const router = express.Router();

router.get ('/health', (req, res) => {
    return successResponse(res, 'Password Reset Router is working');
})
router.post (
    '/generate-password-reset',
    generatePasswordResetToken
);
router.post('/update-password/:token', resetPassword);

module.exports = router;