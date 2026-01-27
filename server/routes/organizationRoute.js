const express = require('express');
const router = express.Router();
const { healthCheck, getUserOrganizationsControl, createOrganization,
    editOrganization,
    deleteOrganization,
    verifyOrganizationController,
    getOrganizationBySlugController,
    joinOrganizationController,
    getAllMembersController,
    leaveOrganizationController,
    getAllOrganizationsController
} = require('../controllers/organizationController');
const authenticateMiddleware = require('../middlewares/authenticateMiddleware');
const checkRole = require('../middlewares/organizationMiddleware');

router.get('/health', healthCheck);

router.get('/user/:userId', getUserOrganizationsControl);

router.get ('/@:slug', authenticateMiddleware, getOrganizationBySlugController);
router.get ('/@:slug/members', authenticateMiddleware, getAllMembersController);
router.post ('/@:slug/', authenticateMiddleware, joinOrganizationController);
router.delete ('/@:slug/', authenticateMiddleware, leaveOrganizationController);
router.get('/', getAllOrganizationsController);
router.post('/', authenticateMiddleware, createOrganization);
router.patch('/:org_id', authenticateMiddleware, editOrganization);
router.delete('/:org_id', authenticateMiddleware, deleteOrganization);
router.post('/verify/:org_id', authenticateMiddleware, verifyOrganizationController);

module.exports = router;
