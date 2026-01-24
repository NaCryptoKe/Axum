export function isApiError(response) {
    return response && response.status === "error";
}

export function getFieldErrors(response) {
    if (
        response &&
        response.error &&
        typeof response.error.details === "object"
    ) {
        return response.error.details;
    }
    return null;
}
