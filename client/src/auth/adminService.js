import { apiRequest } from "../api/client";

/**
 * Get all users
 */
export async function getAllUsers() {
    return apiRequest("/admin/users");
}

/**
 * Get all active users
 */
export async function getActiveUsers() {
    return apiRequest("/admin/users/active");
}

/**
 * Soft delete a user by username
 * @param {string} username 
 */
export async function softDeleteUser(username) {
    return apiRequest(`/admin/@${username}`, {
        method: "DELETE",
    });
}

/**
 * Change a user's role
 * @param {string} username
 * @param {string} role
 */
export async function changeUserRole(username, role) {
    return apiRequest(`/admin/users/@${username}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
    });
}

/**
 * Permanently delete a user
 * @param {string} username
 */
export async function permanentDeleteUser(username) {
    return apiRequest(`/admin/users/@${username}/permanent`, {
        method: "DELETE",
    });
}

/**
 * Undelete a user
 * @param {string} username
 */
export async function undeleteUser(username) {
    return apiRequest(`/admin/users/@${username}/undelete`, {
        method: "PATCH",
    });
}
