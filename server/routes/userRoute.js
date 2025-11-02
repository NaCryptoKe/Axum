const express = require('express');
const router = express.Router();
const {getUserProfile,onlineStatus} = require('../controllers/userController');

router.get('/', (req, res) => {
    res.send ('USER WORKING');
})

router.get('/@:username', getUserProfile);
router.get('/@:username/status', onlineStatus);
module.exports = router;