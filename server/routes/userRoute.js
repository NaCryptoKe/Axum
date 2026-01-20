const express = require('express');
const router = express.Router();

const { successResponse } = require('../utils/responseHandler');

const {
    getUserProfile,
    onlineStatus,
    allUsers,
    allActiveUsers,
    softDelete,
    updateProfile,
    updateProfilePicture,
    changeUserRole,
    permanentDeleteUserController,
    undeleteUserController
} = require('../controllers/userController');

const { getUserOrganizations, getUserOrganizationsControl } = require('../controllers/organizationController');

const authenticateMiddleware = require('../middlewares/authenticateMiddleware');
const isVerifiedMiddleware = require('../middlewares/isVerifiedMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// GET /health
// Description: A basic test route to check if the user router is working.
router.get('/health', (req, res) => {
    return successResponse(res, "USER WORKING");
})

router.use(authenticateMiddleware); // Apply authentication middleware to all subsequent routes

// GET /@:username
// Description: Get a user's profile by their username.
// Access: Authenticated Users
router.get('/:userId/organizations', getUserOrganizationsControl);
router.get('/@:username', getUserProfile);
// DELETE /@:username
// Description: Soft delete a user by their username.
// Access: Authenticated and Verified Users
router.delete('/@:username', isVerifiedMiddleware, softDelete);
// GET /@:username/status
// Description: Get a user's online status by their username.
// Access: Authenticated Users
router.get('/@:username/status', onlineStatus);
// PATCH /@:username/update
// Description: Update an authenticated user's profile information.
// Access: Authenticated and Verified Users
router.patch('/@:username/update', isVerifiedMiddleware, updateProfile);
// PATCH /@:username/update-profile-picture
// Description: Update an authenticated user's profile picture.
// Access: Authenticated and Verified Users
router.patch('/@:username/update-profile-picture', isVerifiedMiddleware, updateProfilePicture);

// GET /active
// Description: Get a list of all active users.
// Access: Authenticated Users
router.get('/active', allActiveUsers); // Accessible by any authenticated user

// Admin-specific routes
const adminRouter = express.Router();
adminRouter.use(adminMiddleware); // Apply admin middleware to all subsequent admin routes
// GET /admin/all
// Description: Get a list of all users, including inactive ones.
// Access: Admin Users Only
adminRouter.get('/all', allUsers);
// PATCH /admin/users/@:username/role
// Description: Change a specific user's role.
// Access: Admin Users Only
adminRouter.patch('/users/@:username/role', changeUserRole);
// DELETE /admin/users/@:username/permanent
// Description: Permanently delete a user from the database.
// Access: Admin Users Only
adminRouter.delete('/users/@:username/permanent', permanentDeleteUserController);
// PATCH /admin/users/@:username/undelete
// Description: Undelete a soft-deleted user account.
// Access: Admin Users Only
adminRouter.patch('/users/@:username/undelete', undeleteUserController);
router.use('/admin', adminRouter);

module.exports = router;