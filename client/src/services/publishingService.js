import { apiRequest } from "../api/client";

/**
 * Publishing Service
 * Base Route: /api/publishing
 */

export async function getAllCategories() {
    return apiRequest("/publishing/categories");
}

export async function createArticle(data) {
    return apiRequest("/publishing/articles", { method: "POST", body: JSON.stringify(data) });
}

export async function getArticle(id) {
    return apiRequest(`/publishing/articles/${id}`);
}

export async function getArticlesByOrg(orgId) {
    return apiRequest(`/publishing/organizations/${orgId}/articles`);
}

export async function updateArticle(id, data) {
    return apiRequest(`/publishing/articles/${id}`, { method: "PUT", body: JSON.stringify(data) });
}