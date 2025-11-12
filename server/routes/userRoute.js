const express = require('express');
const router = express.Router();

const {
    getUserProfile,
    onlineStatus,
    allUsers,
    allActiveUsers,
    softDelete,
    updateProfile,
    updateProfilePicture
} = require('../controllers/userController');

const authenticateMiddleware = require('../middlewares/authenticateMiddleware');

router.get('/', (req, res) => {
    res.send ('USER WORKING');
})

router.use(authenticateMiddleware);

router.get('/@:username', getUserProfile);
router.get('/@:username/delete', softDelete);
router.get('/@:username/status', onlineStatus);
router.patch('/@:username/update', updateProfile);
router.patch('/@:username/update-profile-picture', updateProfilePicture);

module.exports = router;