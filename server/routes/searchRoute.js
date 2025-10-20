const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Search Working");
})

module.exports = router;