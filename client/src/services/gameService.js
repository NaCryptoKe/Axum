import { apiRequest } from "../api/client";

/**
 * Game Service
 * Base Route: /api/games
 */

export async function getPlayerLibrary() {
    return apiRequest("/games/library");
}

export async function createGame(data) {
    return apiRequest("/games/", { method: "POST", body: JSON.stringify(data) });
}

export async function getGameDetail(orgSlug, gameSlug) {
    return apiRequest(`/games/${orgSlug}/${gameSlug}`);
}

export async function getOrganizationGames(orgSlug) {
    return apiRequest(`/games/org/${orgSlug}`);
}

// Discovery
export async function getPopularGames() { return apiRequest("/games/popular"); }
export async function getNewGames() { return apiRequest("/games/new"); }
export async function getTopRatedGames() { return apiRequest("/games/top-rated"); }

// Versions & Assets
export async function createVersion(data) {
    return apiRequest("/games/versions", { method: "POST", body: JSON.stringify(data) });
}

export async function getGameVersions(gameId) {
    return apiRequest(`/games/versions/${gameId}`);
}

export async function deleteAsset(assetId) {
    return apiRequest(`/games/assets/${assetId}`, { method: "DELETE" });
}

// Reviews
export async function postReview(data) {
    return apiRequest("/games/reviews/", { method: "POST", body: JSON.stringify(data) });
}

export async function getGameReviews(gameId) {
    return apiRequest(`/games/reviews/${gameId}`);
}