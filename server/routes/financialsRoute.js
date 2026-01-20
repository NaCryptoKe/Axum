const express = require('express');
const axios = require("axios").default;
const router = express.Router();
const { successResponse, errorResponse } = require('../utils/responseHandler');
const authenticateMiddleware = require('../middlewares/authenticateMiddleware');
const isVerifiedMiddleware = require('../middlewares/isVerifiedMiddleware');

const CHAPA_URL = "https://api.chapa.co/v1/transaction/initialize";
const CHAPA_AUTH = "CHASECK_TEST-v6FTwSdoIXIbHhQPxUFtmG0oow61lVoZ";

const config = {
    headers: {
        Authorization: `Bearer ${CHAPA_AUTH}`,
    }
};

router.get('/health', (req, res) => {
    return successResponse(res, 'PAYMENT WORKING');
});

router.post('/pay', authenticateMiddleware, isVerifiedMiddleware, async (req, res) => {
    try {
        const CALLBACK_URL = "http://localhost:3000/api/finance/verify-payment";
        const RETURN_URL = "http://localhost:3000/api/finance/payment-success";
        const TEXT_REF = "tx-" + Date.now();

        const { amount, currency, email, first_name, last_name } = req.body;

        const data = {
            amount,
            currency,
            email,
            first_name,
            last_name,
            tx_ref: TEXT_REF,
            callback_url: `${CALLBACK_URL}/${TEXT_REF}`,
            return_url: RETURN_URL,
        };

        const response = await axios.post(CHAPA_URL, data, config);

        return successResponse(res, {
            checkout_url: response.data.data.checkout_url,
            tx_ref: TEXT_REF
        });
    } catch (err) {
        console.error("Payment initialization error:", err.response?.data || err.message);
        return errorResponse(res, "Payment initialization failed", 500);
    }
});

// Verify payment
router.get("/verify-payment/:tx_ref", async (req, res) => {
    try {
        const verifyURL = `https://api.chapa.co/v1/transaction/verify/${req.params.tx_ref}`;
        const response = await axios.get(verifyURL, config);

        console.log("Verification response:", response.data);
        return successResponse(res, response.data);
    } catch (err) {
        console.error("Verification error:", err.message);
        return errorResponse(res, "Payment verification failed", 500);
    }
});

// Success endpoint
router.get("/payment-success", (req, res) => {
    return successResponse(res, "Payment successful!");
});

module.exports = router;
