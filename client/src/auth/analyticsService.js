import { apiRequest } from "../api/client";

/**
 * Record a telemetry event
 * @param {Object} eventData - { game_id, session_id, user_id, event_type, payload }
 */
export async function recordTelemetryEvent(eventData) {
    return apiRequest("/analytics/events", {
        method: "POST",
        body: JSON.stringify(eventData),
    });
}
