const express = require('express');
const router = express.Router();
const authenticateMiddleware = require('../middlewares/authenticateMiddleware');
const isVerifiedMiddleware = require('../middlewares/isVerifiedMiddleware');

const {
    registerOrganization,
    editOrganization,
    healthCheck,
    deleteOrganization,
    verifyOrganizationController,
    getOrganizationBySlugController,
    addMemberController,
    getAllMembersController,
    updateMemberRoleController,
    getMemberController
} = require('../controllers/organizationController');

router.get('/', healthCheck);
router.get('/@:slug', getOrganizationBySlugController);

router.use(authenticateMiddleware);
router.use(isVerifiedMiddleware);

router.post('/register', registerOrganization);
router.patch('/update/:id', editOrganization);
router.post('/delete/:id', deleteOrganization);
router.post('/verify/:id', verifyOrganizationController);
router.post('/@:slug/add-member', addMemberController);
router.get('/@:slug/members', getAllMembersController);
router.post('/@:slug/update-role', updateMemberRoleController);
router.get('/@:slug/@:username', getMemberController);

module.exports = router;