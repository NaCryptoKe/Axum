import { apiRequest } from "../api/client";

/**
 * User & Admin Service
 * Base Route: /api/users & /api/admin
 */

export async function getUserProfile(username) {
    return apiRequest(`/users/${username}`);
}

export async function getActiveUsers() {
    return apiRequest("/users/active");
}

export async function getUserStatus(username) {
    return apiRequest(`/users/@${username}/status`);
}

export async function updateProfile(username, data) {
    return apiRequest(`/users/@${username}/update`, { method: "PATCH", body: JSON.stringify(data) });
}

export async function updateProfilePicture(username, formData) {
    // Note: If sending multipart/form-data, handle headers in client
    return apiRequest(`/users/@${username}/update-profile-picture`, { method: "PATCH", body: formData });
}

export async function softDeleteAccount(username) {
    return apiRequest(`/users/@${username}`, { method: "DELETE" });
}

// Admin Specific
export async function adminGetAllUsers() {
    return apiRequest("/users/admin/all");
}

export async function adminChangeRole(username, role) {
    return apiRequest(`/users/admin/users/@${username}/role`, { method: "PATCH", body: JSON.stringify({ role }) });
}

export async function adminUndeleteUser(username) {
    return apiRequest(`/users/admin/users/@${username}/undelete`, { method: "PATCH" });
}

export async function adminPermanentDelete(username) {
    return apiRequest(`/users/admin/users/@${username}/permanent`, { method: "DELETE" });
}