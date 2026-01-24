import { apiRequest } from "../api/client";

export async function authenticate() {
    return apiRequest("/auth/authenticate");
}

/**
 * Login User
 * @param {Object} credentials - { identifier, password }
 */
export async function login(credentials) {
    return apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
    });
}

/**
 * Register a new user
 * @param {Object} userData - { firstname, lastname, username, email, password }
 */
export async function register(userData) {
    return apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
    });
}

export async function logout() {
    return apiRequest("/auth/logout", {
        method: "POST",
    });
}

export async function generateResetLink(data) {
    return apiRequest(`/password-reset/generate-password-reset`, {
        method: "POST",
        body: JSON.stringify(data)
    });
}

/**
 * Reset Password
 * @param {string} token - The unique token from the URL
 * @param {Object} data - { newPassword }
 */
export async function resetPassword(token, data) {
    // We inject the token variable directly into the string
    return apiRequest(`/password-reset/update-password/${token}`, {
        method: "POST",
        body: JSON.stringify(data)
    });
}

/**
 * Verify OTP
 * @param {Object} data - { user_id, otp }
 */
export async function verifyOtp(data) {
    return apiRequest(`/auth/verify-otp`, {
        method: "POST",
        body: JSON.stringify(data)
    });
}

/**
 * Resend OTP
 * @param {Object} data - { user_id }
 */
export async function generateOtp(data) {
    return apiRequest(`/auth/generate-otp`, {
        method: "POST",
        body: JSON.stringify(data)
    });
}
/**
 * Fetch a specific user's profile
 * @param {string} username
 */
export async function getUserProfile(username) {
    // API expects /api/users/@johndoe
    return apiRequest(`/users/${username}`, {
        method: "GET"
    });
}
/**
 * Update a specific user's profile picture
 * @param {string} username
 * @param {Object} data - { avatar_url: string }
 */
export async function updateProfilePicture(username, data) {
    // API expects /api/users/@username/update-profile-picture
    return apiRequest(`/users/${username}/update-profile-picture`, {
        method: "PATCH",
        body: JSON.stringify(data)
    });
}
export async function updateProfile(username, updateData) {
    return apiRequest(`/users/${username}/update`, {
        method: "PATCH",
        body: JSON.stringify(updateData)
    });
}

/**
 * Soft delete a user account
 * @param {string} username 
 */
export async function deleteUser(username) {
    return apiRequest(`/users/${username}`, {
        method: "DELETE",
    });
}

/**
 * Follow a user
 * @param {string} userId - The ID of the user to follow
 */
export async function followUser(userId) {
    return apiRequest("/social/follow", {
        method: "POST",
        body: JSON.stringify({ user_id: userId }),
    });
}

/**
 * Unfollow a user
 * @param {string} userId - The ID of the user to unfollow
 */
export async function unfollowUser(userId) {
    return apiRequest("/social/unfollow", {
        method: "POST",
        body: JSON.stringify({ user_id: userId }),
    });
}