import { apiRequest } from "../api/client";

// --- Category Routes ---

/**
 * Create a new category
 * @param {Object} categoryData - { name, slug, description }
 */
export async function createCategory(categoryData) {
    return apiRequest("/publishing/categories", {
        method: "POST",
        body: JSON.stringify(categoryData),
    });
}

/**
 * Get all categories
 */
export async function getAllCategories() {
    return apiRequest("/publishing/categories");
}

// --- Article Routes ---

/**
 * Create a new article
 * @param {Object} articleData - { org_id, title, body, category_id }
 */
export async function createArticle(articleData) {
    return apiRequest("/publishing/articles", {
        method: "POST",
        body: JSON.stringify(articleData),
    });
}

/**
 * Get an article by its ID
 * @param {string} id
 */
export async function getArticle(id) {
    return apiRequest(`/publishing/articles/${id}`);
}

/**
 * Get all articles for an organization
 * @param {string} org_id
 */
export async function getArticlesByOrganization(org_id) {
    return apiRequest(`/publishing/organizations/${org_id}/articles`);
}

/**
 * Update an article
 * @param {string} id
 * @param {Object} articleData - { title, body, category_id }
 */
export async function updateArticle(id, articleData) {
    return apiRequest(`/publishing/articles/${id}`, {
        method: "PUT",
        body: JSON.stringify(articleData),
    });
}

/**
 * Delete an article
 * @param {string} id
 */
export async function deleteArticle(id) {
    return apiRequest(`/publishing/articles/${id}`, {
        method: "DELETE",
    });
}
