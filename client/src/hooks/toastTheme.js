// client/src/config/toastTheme.js
export const TOAST_THEME = {
    limit: 5,
    defaultDuration: 4000,
    // Centralized glass effect settings
    glass: {
        blur: 12,
        opacity: 0.3,       // Slightly lower for better clarity on your game background
        distortion: 77,
        frequency: 0.08
    },
    types: {
        success: {
            title: "Success",
            color: "#28a745",
            icon: '<polyline points="20 6 9 17 4 12"></polyline>' 
        },
        error: {
            title: "Error",
            color: "#E50914",
            icon: '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>'
        },
        warning: {
            title: "Warning",
            color: "#ffa500",
            icon: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>'
        },
        info: {
            title: "Information",
            color: "#17a2b8",
            icon: '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>'
        }
    }
};