const express = require('express');
const router = express.Router();
const { healthCheck, getUserOrganizationsControl } = require('../controllers/organizationController');

router.get('/', healthCheck);
//router.post('/', registerOrganization);
router.get('/user/:userId', getUserOrganizationsControl);

module.exports = router;
