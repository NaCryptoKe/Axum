import { apiRequest } from "../api/client";

/**
 * Initialize a payment
 * @param {Object} paymentData - { amount, currency, email, first_name, last_name }
 */
export async function initializePayment(paymentData) {
    return apiRequest("/finance/pay", {
        method: "POST",
        body: JSON.stringify(paymentData),
    });
}

/**
 * Verify a payment
 * @param {string} tx_ref - The transaction reference
 */
export async function verifyPayment(tx_ref) {
    return apiRequest(`/finance/verify-payment/${tx_ref}`);
}
