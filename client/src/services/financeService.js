import { apiRequest } from "../api/client";

/**
 * Financial Service
 * Base Route: /api/finance
 */

export async function initiatePayment(data) {
    return apiRequest("/finance/pay", { method: "POST", body: JSON.stringify(data) });
}

export async function verifyPayment(txRef) {
    return apiRequest(`/finance/verify-payment/${txRef}`);
}