import { apiRequest } from "../api/client";

/**
 * Organization Service
 * Base Route: /api/organizations
 */

export async function createOrganization(data) {
    return apiRequest("/organizations/", { 
            method: "POST", 
            body: JSON.stringify(data) 
        });
}

export async function getAllOrganizations() {
    return apiRequest("/organizations/");
}

export async function getOrganizationBySlug(slug) {
    return apiRequest(`/organizations/${slug}`);
}

export async function getOrgMembers(slug) {
    return apiRequest(`/organizations/${slug}/members`);
}

export async function getOrgMember(slug, username) {
    return apiRequest(`/organizations/${slug}/@${username}`);
}

export async function joinOrganization(slug) {
    return apiRequest(`/organizations/@${slug}/`, { method: "POST" });
}

export async function leaveOrganization(slug) {
    return apiRequest(`/organizations/@${slug}/`, { method: "DELETE" });
}

export async function updateOrganization(orgId, data) {
    return apiRequest(`/organizations/${orgId}`, { method: "PATCH", body: JSON.stringify(data) });
}

export async function deleteOrganization(orgId) {
    return apiRequest(`/organizations/${orgId}`, { method: "DELETE" });
}

export async function verifyOrganization(orgId) {
    return apiRequest(`/organizations/verify/${orgId}`, { method: "POST" });
}