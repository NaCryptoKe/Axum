const express = require("express");
const { getDebugStats } = require("../controllers/debugController.js");
const { exec } = require('child_process');
const path = require('path');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const router = express.Router();

router.get("/stats", getDebugStats);

router.get("/db-test", (req, res) => {
    // Using path.resolve to ensure the path is correct regardless of where the app is run from
    const scriptPath = path.resolve(__dirname, '..', 'config', 'test-db.js');

    exec(`node ${scriptPath}`, (error, stdout, stderr) => {
        const output = {
            stdout,
            stderr
        };

        if (error) {
            console.error(`Database test script execution failed: ${error.message}`);
            return errorResponse(res, 'Database test script execution failed.', 500, 'DB_TEST_FAILED', error.message, output);
        }

        return successResponse(res, {
            message: 'Database test script executed successfully.',
            ...output
        });
    });
});

module.exports = router;
