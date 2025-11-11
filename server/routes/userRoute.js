const express = require('express');
const router = express.Router();
const {getUserProfile,onlineStatus,allUsers, allActiveUsers, updateProfile} = require('../controllers/userController');
const {authenticateMiddleware} = require('../controllers/authController');
router.get('/', (req, res) => {
    res.send ('USER WORKING');
})

router.get('/@:username', authenticateMiddleware,getUserProfile);
router.get('/@:username/status', onlineStatus);
router.patch('/@:username/update', updateProfile);

module.exports = router;