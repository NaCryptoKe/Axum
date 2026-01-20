const express = require('express');
const router = express.Router();
const { allUsers, allActiveUsers, softDelete } = require('../controllers/userController');
const { successResponse } = require('../utils/responseHandler');

router.get('/health', (req, res) => {
    return successResponse(res, 'ADMIN WORKING');
})

router.get('/users', allUsers);
router.get('/users/active', allActiveUsers);
router.delete('/@:username', softDelete);

module.exports = router;