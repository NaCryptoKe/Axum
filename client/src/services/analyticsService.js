import { apiRequest } from "../api/client";

/**
 * Analytics Service
 * Base Route: /api/analytics
 */

export async function trackEvent(eventData) {
    return apiRequest("/analytics/events", { method: "POST", body: JSON.stringify(eventData) });
}