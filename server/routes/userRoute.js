const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// =========================== BASIC CRUD ===============================
router.get('/', userController.getAllUsers);
router.get('/@:username', userController.getUserByUsername);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/soft/:id', userController.softDeleteUser);
router.patch('/restore/:id', userController.restoreUser);
router.delete('/hard/:id', userController.hardDeleteUser);

// =========================== AUTH ===============================
router.post('/auth/login', userController.login);
router.post('/auth/logout', userController.logout);
router.post('/auth/change-password/:id', userController.changePassword);

// =========================== FOLLOW SYSTEM ===============================
router.post('/follow', userController.followUser);
router.post('/unfollow', userController.unfollowUser);
router.get('/:id/followers', userController.getFollowers);
router.get('/:id/following', userController.getFollowing);

// =========================== MODERATION ===============================
router.post('/moderation/ban', userController.banUser);
router.post('/moderation/unban', userController.unbanUser);
router.get('/moderation/banned', userController.getBannedUsers);

module.exports = router;
