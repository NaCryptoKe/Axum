import { apiRequest } from "../api/client";

/**
 * Get all organizations for a user
 * @param {string} userId
 */
export async function getUserOrganizations(userId) {
    return apiRequest(`/organizations/user/${userId}`);
}
