import { apiRequest } from "../api/client";

/**
 * Notification Service
 * Base Route: /api/notifications
 */

export async function fetchNotifications() {
    return apiRequest("/notifications/");
}

export async function markAsRead(id) {
    return apiRequest(`/notifications/${id}/read`, { method: "PUT" });
}

export async function deleteNotification(id) {
    return apiRequest(`/notifications/${id}`, { method: "DELETE" });
}

export async function getNotificationPreferences() {
    return apiRequest("/notifications/preferences");
}

export async function updateNotificationPreferences(data) {
    return apiRequest("/notifications/preferences", { method: "POST", body: JSON.stringify(data) });
}