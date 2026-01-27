import { apiRequest } from "../api/client";

export async function getOrganization(slug) {
    return apiRequest(`/organizations/@${slug}`);
}

export async function getOrganizationMembers(slug) {
    return apiRequest(`/organizations/@${slug}/members`);
}

// FIX: Moved the closing parenthesis to include the options object
export async function joinOrganization(slug, data) {
    return apiRequest(`/organizations/@${slug}`, {
        method: "POST",
        body: JSON.stringify(data)
    });
}

export async function leaveOrganization(slug, data) {
    return apiRequest(`/organizations/@${slug}`, {
        method: "DELETE",
        body: JSON.stringify(data)
    });
}

export async function createOrganization(data) {
    return apiRequest(`/organizations/`, {
        method: "POST",
        body: JSON.stringify(data)
    });
}

export async function updateOrganization(org_id, data) {
    return apiRequest(`/organizations/${org_id}`, {
        method: "PATCH",
        body: JSON.stringify(data)
    });
}

export async function softDeleteOrganization(org_id) {
    return apiRequest(`/organizations/${org_id}`, {
        method: "DELETE"
    });
}

export async function verifyOrganization(org_id) {
    return apiRequest(`/organizations/verify/${org_id}`, {
        method: "POST"
    });
}

export async function getAllOrganizations() {
    return apiRequest(`/organizations/`, {
        method: "GET"
    });
}