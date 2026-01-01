const express = require('express');
const { rateLimiter } = require('../middlewares/rateLimiter');
const { checkCooldown } = require('../middlewares/checkCooldown');


const { generatePasswordResetToken, resetPassword} = require ('../controllers/passwordResetController')
const router = express.Router();

router.get ('/', (req, res) => {
    res.json ({
        success: true,
        message: 'Password Reset Router is working',
        data: null,
        error: null
    });
})
router.post (
    '/generate-password-reset', 
    rateLimiter,
    checkCooldown,
    generatePasswordResetToken
);
router.post('/update-password/:token', resetPassword);

module.exports = router;