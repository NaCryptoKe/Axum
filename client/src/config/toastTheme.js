// client/src/config/toastTheme.js
export const TOAST_THEME = {
    limit: 5,
    defaultDuration: 4000,
    types: {
        success: {
            title: "Success",
            color: "#28a745",
            // You can paste your SVG string or React component here
            icon: '<polyline points="20 6 9 17 4 12"></polyline>' 
        },
        // ... add other custom overrides here
    }
};