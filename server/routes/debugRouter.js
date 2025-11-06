const  express = require("express");
const { getDebugStats } = require("../controllers/debugController.js");

const router = express.Router();

router.get("/stats", getDebugStats);

module.exports = router;
