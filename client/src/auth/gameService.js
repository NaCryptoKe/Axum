import { apiRequest } from "../api/client";

/**
 * Create a new game
 * @param {Object} gameData - { org_id, title, slug, description, etc. }
 */
export async function createGame(gameData) {
    return apiRequest("/games", {
        method: "POST",
        body: JSON.stringify(gameData),
    });
}

/**
 * Fetch a specific game by organization and game slug
 */
export async function getGame(orgSlug, gameSlug) {
    return apiRequest(`/games/${orgSlug}/${gameSlug}`);
}

/**
 * Update game details
 */
export async function updateGame(gameId, updates) {
    return apiRequest(`/games/${gameId}`, {
        method: "PUT",
        body: JSON.stringify(updates),
    });
}

/**
 * Soft delete a game
 */
export async function deleteGame(gameId) {
    return apiRequest(`/games/${gameId}`, {
        method: "DELETE",
    });
}

/**
 * Get all games belonging to a specific organization
 */
export async function getOrganizationGames(orgSlug) {
    return apiRequest(`/games/org/${orgSlug}`);
}

export async function createGameVersion(versionData) {
    return apiRequest("/games/versions", {
        method: "POST",
        body: JSON.stringify(versionData),
    });
}

export async function getGameVersions(gameId) {
    return apiRequest(`/games/versions/${gameId}`);
}

export async function createGameAsset(assetData) {
    return apiRequest("/games/assets", {
        method: "POST",
        body: JSON.stringify(assetData),
    });
}

export async function getAssetsByVersion(versionId) {
    return apiRequest(`/games/assets/${versionId}`);
}

export async function getAllTags() {
    return apiRequest("/games/tags");
}

export async function assignTagToGame(gameId, tagId) {
    return apiRequest("/games/tags/assign", {
        method: "POST",
        body: JSON.stringify({ game_id: gameId, tag_id: tagId }),
    });
}

/**
 * Discovery feeds
 */
export async function getPopularGames() {
    return apiRequest("/games/popular");
}

export async function getNewGames() {
    return apiRequest("/games/new");
}

/**
 * Create a game review
 * @param {Object} reviewData - { game_id, rating, title, body }
 */
export async function createReview(reviewData) {
    return apiRequest("/games/reviews", {
        method: "POST",
        body: JSON.stringify(reviewData),
    });
}

export async function getGameReviews(gameId) {
    return apiRequest(`/games/reviews/${gameId}`);
}

export async function updateReview(reviewId, updateData) {
    return apiRequest(`/games/reviews/${reviewId}`, {
        method: "PUT",
        body: JSON.stringify(updateData),
    });
}

/**
 * Fetch the current user's library
 */
export async function getPlayerLibrary() {
    return apiRequest("/games/library");
}