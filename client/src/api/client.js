const API_BASE = "https://axumm.up.railway.app";

export async function apiRequest(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        credentials: "include",
        headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        },
        ...options,
    });

    const json = await res.json();
    return json;
}

// Connects to the backend