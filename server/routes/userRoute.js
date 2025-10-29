const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', (req, res) => {
    res.send ('USER WORKING');
})

module.exports = router;