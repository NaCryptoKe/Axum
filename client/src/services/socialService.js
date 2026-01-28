import { apiRequest } from "../api/client";

/**
 * Social Service
 * Base Route: /api/social
 */

export async function followUser(userId) {
    return apiRequest("/social/follow", { method: "POST", body: JSON.stringify({ userId }) });
}

export async function unfollowUser(userId) {
    return apiRequest("/social/unfollow", { method: "POST", body: JSON.stringify({ userId }) });
}

export async function getConversations() {
    return apiRequest("/social/conversations");
}

export async function getMessages(conversationId) {
    return apiRequest(`/social/conversations/${conversationId}/messages`);
}

export async function sendMessage(conversationId, content) {
    return apiRequest(`/social/conversations/${conversationId}/messages`, {
        method: "POST",
        body: JSON.stringify({ content })
    });
}