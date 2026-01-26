import { apiRequest } from "../api/client";

/**
 * Get all notifications for the current user
 */
export async function getNotifications() {
    return apiRequest("/notifications");
}

/**
 * Mark a notification as read
 * @param {string} notificationId
 */
export async function markAsRead(notificationId) {
    return apiRequest(`/notifications/${notificationId}/read`, {
        method: "PUT",
    });
}

/**
 * Delete a notification
 * @param {string} notificationId
 */
export async function deleteNotification(notificationId) {
    return apiRequest(`/notifications/${notificationId}`, {
        method: "DELETE",
    });
}

/**
 * Get notification preferences for the current user
 */
export async function getPreferences() {
    return apiRequest("/notifications/preferences");
}

/**
 * Set notification preferences for the current user
 * @param {Object} preferences
 */
export async function setPreferences(preferences) {
    return apiRequest("/notifications/preferences", {
        method: "POST",
        body: JSON.stringify(preferences),
    });
}
