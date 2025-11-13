const express = require('express');
const router = express.Router();

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
} = require('../controllers/organizationController');

router.get('/', healthCheck);

router.post('/register', registerOrganization);
router.patch('/update/:id', editOrganization);
router.post('/delete/:id', deleteOrganization);
router.post('/verify/:id', verifyOrganizationController);
router.get('/@:slug', getOrganizationBySlugController);
router.post('/@:slug/add-member', addMemberController);
router.get('/@:slug/members', getAllMembersController);
router.post('/@:slug/update-role', updateMemberRoleController);

module.exports = router;