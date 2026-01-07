const express = require('express');
const router = express.Router();

const {
    getUserProfile,
    onlineStatus,
    allUsers,
    allActiveUsers,
    softDelete,
    updateProfile,
    updateProfilePicture,
    changeUserRole,
    permanentDeleteUserController
} = require('../controllers/userController');

const authenticateMiddleware = require('../middlewares/authenticateMiddleware');
const isVerifiedMiddleware = require('../middlewares/isVerifiedMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.get('/', (req, res) => {
    return res.status(200).json({
        "success": true,
        "message": "USER WORKING",
        "data": null,
        "error": null
    });
})

router.use(authenticateMiddleware);
router.use(isVerifiedMiddleware);

router.get('/@:username', getUserProfile);
router.delete('/@:username', softDelete);
router.get('/@:username/status', onlineStatus);
router.patch('/@:username/update', updateProfile);
router.patch('/@:username/update-profile-picture', updateProfilePicture);

router.get('/active', allActiveUsers); // Accessible by any authenticated user

// Admin-specific routes
const adminRouter = express.Router();
adminRouter.use(adminMiddleware);
adminRouter.get('/all', allUsers);
adminRouter.patch('/users/@:username/role', changeUserRole);
adminRouter.delete('/users/@:username/permanent', permanentDeleteUserController);
router.use('/admin', adminRouter);

// All routes are complete and functional

module.exports = router;