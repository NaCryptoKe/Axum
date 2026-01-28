import { apiRequest } from "../api/client";

/**
 * Password Reset Service
 * Base Route: /api/password-reset
 */

export async function requestPasswordReset(email) {
    return apiRequest("/password-reset/generate-password-reset", { 
        method: "POST", 
        body: JSON.stringify({ email }) 
    });
}

export async function updatePassword(token, password) {
    return apiRequest(`/password-reset/update-password/${token}`, { 
        method: "POST", 
        body: JSON.stringify({ password }) 
    });
}