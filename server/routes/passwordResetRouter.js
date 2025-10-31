const express = require('express');
const { rateLimiter } = require('../middlewares/rateLimiter');
const { checkCooldown } = require('../middlewares/checkCooldown');


const { generatePasswordResetToken, verifyPasswordResetToken } = require ('../controllers/passwordResetController')
const router = express.Router();

router.get ('/', (req, res) => {
    res.send ('Password Reset');
})
router.post ('/generate_password_reset', generatePasswordResetToken, rateLimiter, checkCooldown);
router.post ('/verify_password_reset', verifyPasswordResetToken);

module.exports = router;