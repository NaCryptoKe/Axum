const express = require('express');
const router = express.Router();
const authenticateMiddleware = require('../middlewares/authenticateMiddleware');
const isVerifiedMiddleware = require('../middlewares/isVerifiedMiddleware');
const { checkRole } = require('../middlewares/organizationMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

const {
    registerOrganization,
    editOrganization,
    healthCheck,
    deleteOrganization,
    verifyOrganizationController,
    getOrganizationBySlugController,
    joinOrganizationController,
    addMemberByAdminController,
    getAllMembersController,
    updateMemberRoleController,
    getMemberController,
    removeMemberController
} = require('../controllers/organizationController');

// Public routes
router.get('/', healthCheck);
router.get('/@:slug', getOrganizationBySlugController);

// Authenticated routes
router.use(authenticateMiddleware);
router.use(isVerifiedMiddleware);

router.post('/register', registerOrganization);
router.post('/@:slug/join', joinOrganizationController);

// Organization management routes with role checks
router.patch('/@:slug', checkRole(['owner']), editOrganization);
router.delete('/@:slug', checkRole(['owner']), deleteOrganization);
router.post('/@:slug/verify', checkRole(['owner']), verifyOrganizationController);


// Member management routes
router.get('/@:slug/members', checkRole(['owner', 'admin', 'member']), getAllMembersController);
router.post('/@:slug/members', checkRole(['owner', 'admin']), addMemberByAdminController);
router.patch('/@:slug/members/@:username/role', checkRole(['owner', 'admin']), updateMemberRoleController);
router.get('/@:slug/members/@:username', checkRole(['owner', 'admin', 'member']), getMemberController);
router.delete('/@:slug/members/@:username', removeMemberController);


module.exports = router;