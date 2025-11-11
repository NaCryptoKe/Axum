const express = require('express');
const { rateLimiter } = require('../middlewares/rateLimiter');
const { checkCooldown } = require('../middlewares/checkCooldown');


const { generatePasswordResetToken, resetPassword} = require ('../controllers/passwordResetController')
const router = express.Router();

router.get ('/', (req, res) => {
    res.send ('Password Reset');
})
router.post (
    '/generate-password-reset',
    generatePasswordResetToken
);
router.post('/update-password/:token', resetPassword);

module.exports = router;