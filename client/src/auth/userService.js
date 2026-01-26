import { apiRequest } from "../api/client";

/**
 * Fetch a specific user's profile
 * @param {string} username
 */
export async function getUserProfile(username) {
    // API expects /api/users/@johndoe
    return apiRequest(`/users/@${username}`, {
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
    return apiRequest(`/users/@${username}/update-profile-picture`, {
        method: "PATCH",
        body: JSON.stringify(data)
    });
}
export async function updateProfile(username, updateData) {
    return apiRequest(`/users/@${username}/update`, {
        method: "PATCH",
        body: JSON.stringify(updateData)
    });
}

/**
 * Soft delete a user account
 * @param {string} username 
 */
export async function deleteUser(username) {
    return apiRequest(`/users/@${username}`, {
        method: "DELETE",
    });
}

/**
 * Get user's online status
 * @param {string} username
 */
export async function getOnlineStatus(username) {
    return apiRequest(`/users/@${username}/status`);
}
