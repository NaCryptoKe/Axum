import { apiRequest } from "../api/client";

/**
 * Community Service
 * Base Route: /api/community
 */

// Spaces
export async function createSpace(data) {
    return apiRequest("/community/spaces", { method: "POST", body: JSON.stringify(data) });
}

export async function getSpace(slug) {
    return apiRequest(`/community/spaces/${slug}`);
}

// Posts
export async function createPost(data) {
    return apiRequest("/community/posts", { method: "POST", body: JSON.stringify(data) });
}

export async function getPostsBySpace(spaceSlug) {
    return apiRequest(`/community/spaces/${spaceSlug}/posts`);
}

// Comments
export async function addComment(data) {
    return apiRequest("/community/comments", { method: "POST", body: JSON.stringify(data) });
}

export async function getPostComments(postId) {
    return apiRequest(`/community/posts/${postId}/comments`);
}

// Voting
export async function votePost(postId, value) {
    return apiRequest(`/community/posts/${postId}/vote`, { method: "POST", body: JSON.stringify({ value }) });
}

export async function voteComment(commentId, value) {
    return apiRequest(`/community/comments/${commentId}/vote`, { method: "POST", body: JSON.stringify({ value }) });
}