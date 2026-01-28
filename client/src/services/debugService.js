import { apiRequest } from "../api/client";

/**
 * Debug Service
 * Base Route: /api/debug
 */

export async function getStats() {
    return apiRequest("/debug/stats");
}

export async function runDbTest() {
    return apiRequest("/debug/db-test");
}