import { apiRequest } from "../api/client";

/**
 * Follow a user
 * @param {string} userId - The ID of the user to follow
 */
export async function followUser(userId) {
    return apiRequest("/social/follow", {
        method: "POST",
        body: JSON.stringify({ user_id: userId }),
    });
}

/**
 * Unfollow a user
 * @param {string} userId - The ID of the user to unfollow
 */
export async function unfollowUser(userId) {
    return apiRequest("/social/unfollow", {
        method: "POST",
        body: JSON.stringify({ user_id: userId }),
    });
}

/**
 * Create a new conversation
 * @param {Object} data - { recipient_id, initial_message }
 */
export async function createConversation(data) {
    return apiRequest("/social/conversations", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

/**
 * Get all conversations for the current user
 */
export async function getConversations() {
    return apiRequest("/social/conversations");
}

/**
 * Get all message requests for the current user
 */
export async function getMessageRequests() {
    return apiRequest("/social/conversations/requests");
}

/**
 * Accept a message request
 * @param {string} conversation_id
 */
export async function acceptMessageRequest(conversation_id) {
    return apiRequest(`/social/conversations/${conversation_id}/accept`, {
        method: "POST",
    });
}

/**
 * Create a new message in a conversation
 * @param {string} conversation_id
 * @param {Object} data - { body }
 */
export async function createMessage(conversation_id, data) {
    return apiRequest(`/social/conversations/${conversation_id}/messages`, {
        method: "POST",
        body: JSON.stringify(data),
    });
}

/**
 * Get all messages in a conversation
 * @param {string} conversation_id
 */
export async function getMessages(conversation_id) {
    return apiRequest(`/social/conversations/${conversation_id}/messages`);
}
