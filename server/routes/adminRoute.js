const express = require('express');
const router = express.Router();
const {getUserProfile,onlineStatus,allUsers, allActiveUsers, updateProfile, softDelete} = require('../controllers/userController');

router.get('/', (req, res) => {
    res.send ('ADMIN WORKING');
})

router.get('/users', allUsers);
router.get('/users/active', allActiveUsers);
router.delete('/@:username', softDelete);

module.exports = router;