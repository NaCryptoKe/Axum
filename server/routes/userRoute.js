const express = require('express');
const router = express.Router();
const {getUserProfile,onlineStatus,allUsers, allActiveUsers} = require('../controllers/userController');

router.get('/', (req, res) => {
    res.send ('USER WORKING');
})

router.get('/@:username', getUserProfile);
router.get('/@:username/status', onlineStatus);
router.get('/users', allUsers);
router.get('/users/active', allActiveUsers);

module.exports = router;