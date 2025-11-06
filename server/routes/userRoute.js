const express = require('express');
const router = express.Router();
const {getUserProfile,onlineStatus,allUsers, allActiveUsers, updateProfile} = require('../controllers/userController');

router.get('/', (req, res) => {
    res.send ('USER WORKING');
})

router.get('/@:username', getUserProfile);
router.get('/@:username/status', onlineStatus);
router.patch('/@:username/update', updateProfile);

module.exports = router;