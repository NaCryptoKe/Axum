import { apiRequest } from "../api/client";

/**
 * Authentication Service
 * Base Route: /api/auth
 */

export async function register(data) {
    return apiRequest("/auth/register", { 
        method: "POST", 
        body: JSON.stringify(data) 
    });
}

export async function login(credentials) {
    return apiRequest("/auth/login", { 
        method: "POST", 
        body: JSON.stringify(credentials) 
    });
}

export async function logout() {
    return apiRequest("/auth/logout", { 
        method: "POST",
        credentials: 'include'
    });
}

export async function checkAuthStatus() {
    return apiRequest("/auth/authenticate");
}

export async function getAllSessions() {
    return apiRequest("/auth/sessions");
}

export async function terminateSession(sessionId) {
    return apiRequest(`/auth/sessions/${sessionId}`, { 
        method: "DELETE"
    });
}

// Google OAuth
//export const googleAuthUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;

// OTP Management
export async function generateOtp(userId) {
    return apiRequest("/auth/generate-otp", { 
        method: "POST", 
        body: JSON.stringify({ userId }) 
    });
}

export async function verifyOtp(userId, otp) {
    return apiRequest("/auth/verify-otp", { 
        method: "POST", 
        body: JSON.stringify({ userId, otp }) 
    });
}