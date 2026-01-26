import { apiRequest } from "../api/client";

// --- Space Routes ---

/**
 * Create a new community space.
 * @param {Object} spaceData - { related_game_id, name, slug, description }
 */
export async function createSpace(spaceData) {
    return apiRequest("/community/spaces", {
        method: "POST",
        body: JSON.stringify(spaceData),
    });
}

/**
 * Retrieve a space by its slug.
 * @param {string} slug 
 */
export async function getSpace(slug) {
    return apiRequest(`/community/spaces/${slug}`);
}

/**
 * Update a space's details.
 * @param {string} id
 * @param {Object} spaceData - { name, slug, description }
 */
export async function updateSpace(id, spaceData) {
    return apiRequest(`/community/spaces/${id}`, {
        method: "PUT",
        body: JSON.stringify(spaceData),
    });
}

/**
 * Soft delete a space.
 * @param {string} id
 */
export async function softDeleteSpace(id) {
    return apiRequest(`/community/spaces/${id}`, {
        method: "DELETE",
    });
}

/**
 * Undelete a soft-deleted space.
 * @param {string} id
 */
export async function undeleteSpace(id) {
    return apiRequest(`/community/spaces/${id}/undelete`, {
        method: "PUT",
    });
}

// --- Post Routes ---

/**
 * Create a new post in a space.
 * @param {Object} postData - { space_id, title, body }
 */
export async function createPost(postData) {
    return apiRequest("/community/posts", {
        method: "POST",
        body: JSON.stringify(postData),
    });
}

/**
 * Retrieve a post by its ID.
 * @param {string} id
 */
export async function getPost(id) {
    return apiRequest(`/community/posts/${id}`);
}

/**
 * Retrieve all posts in a space.
 * @param {string} spaceSlug
 */
export async function getPostsBySpace(spaceSlug) {
    return apiRequest(`/community/spaces/${spaceSlug}/posts`);
}

/**
 * Update a post's details.
 * @param {string} id
 * @param {Object} postData - { title, body }
 */
export async function updatePost(id, postData) {
    return apiRequest(`/community/posts/${id}`, {
        method: "PUT",
        body: JSON.stringify(postData),
    });
}

/**
 * Soft delete a post.
 * @param {string} id
 */
export async function softDeletePost(id) {
    return apiRequest(`/community/posts/${id}`, {
        method: "DELETE",
    });
}

/**
 * Undelete a soft-deleted post.
 * @param {string} id
 */
export async function undeletePost(id) {
    return apiRequest(`/community/posts/${id}/undelete`, {
        method: "PUT",
    });
}

// --- Comment Routes ---

/**
 * Create a new comment on a post.
 * @param {Object} commentData - { post_id, parent_comment_id, body }
 */
export async function createComment(commentData) {
    return apiRequest("/community/comments", {
        method: "POST",
        body: JSON.stringify(commentData),
    });
}

/**
 * Retrieve a comment by its ID.
 * @param {string} id
 */
export async function getComment(id) {
    return apiRequest(`/community/comments/${id}`);
}

/**
 * Retrieve all comments for a post.
 * @param {string} postId
 */
export async function getCommentsByPost(postId) {
    return apiRequest(`/community/posts/${postId}/comments`);
}

/**
 * Update a comment's body.
 * @param {string} id
 * @param {Object} commentData - { body }
 */
export async function updateComment(id, commentData) {
    return apiRequest(`/community/comments/${id}`, {
        method: "PUT",
        body: JSON.stringify(commentData),
    });
}

/**
 * Soft delete a comment.
 * @param {string} id
 */
export async function softDeleteComment(id) {
    return apiRequest(`/community/comments/${id}`, {
        method: "DELETE",
    });
}

/**
 * Undelete a soft-deleted comment.
 * @param {string} id
 */
export async function undeleteComment(id) {
    return apiRequest(`/community/comments/${id}/undelete`, {
        method: "PUT",
    });
}

// --- Vote Routes ---

/**
 * Add an upvote or downvote to a post.
 * @param {string} postId
 * @param {number} value - 1 for upvote, -1 for downvote
 */
export async function addPostVote(postId, value) {
    return apiRequest(`/community/posts/${postId}/vote`, {
        method: "POST",
        body: JSON.stringify({ value }),
    });
}

/**
 * Remove a user's vote from a post.
 * @param {string} postId
 */
export async function removePostVote(postId) {
    return apiRequest(`/community/posts/${postId}/vote`, {
        method: "DELETE",
    });
}

/**
 * Add an upvote or downvote to a comment.
 * @param {string} commentId
 * @param {number} value - 1 for upvote, -1 for downvote
 */
export async function addCommentVote(commentId, value) {
    return apiRequest(`/community/comments/${commentId}/vote`, {
        method: "POST",
        body: JSON.stringify({ value }),
    });
}

/**
 * Remove a user's vote from a comment.
 * @param {string} commentId
 */
export async function removeCommentVote(commentId) {
    return apiRequest(`/community/comments/${commentId}/vote`, {
        method: "DELETE",
    });
}
