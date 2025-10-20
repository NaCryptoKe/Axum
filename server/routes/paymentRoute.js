const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Payment Working");
})

module.exports = router;