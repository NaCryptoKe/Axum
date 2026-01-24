const notificationModel = require('../models/notificationModel');
const userModel = require('../models/userModel'); // Assuming we need to fetch user details for some notifications

const createNotification = async ({ recipient_id, actor_id, type, data }) => {
    try {
        const notification = await notificationModel.createNotification({ recipient_id, actor_id, type, data });
        // TODO: Potentially emit a real-time event for the recipient
        return notification;
    } catch (error) {
        console.error("Error creating notification:", error);
        // Depending on criticality, might throw or just log
        return null;
    }
};

const getNotifications = async (req, res) => {
    const { user } = req;
    if (!user?.id) return res.status(401).json({ status: "error", message: "Unauthorized", error: { code: 401, details: "User not authenticated." }, meta: { timestamp: new Date().toISOString() } });

    try {
        const notifications = await notificationModel.getNotificationsByRecipient(user.id, false); // Get unread by default
        return res.status(200).json({ status: "success", message: "Notifications retrieved", data: notifications, meta: { timestamp: new Date().toISOString() } });
    } catch (error) {
        console.error("Get Notifications Error:", error);
        return res.status(500).json({ status: "error", message: "Server Error", error: { code: 500, details: error.message }, meta: { timestamp: new Date().toISOString() } });
    }
};

const markAsRead = async (req, res) => {
    const { user } = req;
    const { id } = req.params; // Notification ID
    if (!user?.id) return res.status(401).json({ status: "error", message: "Unauthorized", error: { code: 401, details: "User not authenticated." }, meta: { timestamp: new Date().toISOString() } });

    try {
        const notification = await notificationModel.markNotificationAsRead(id);
        if (!notification) return res.status(404).json({ status: "error", message: "Notification not found.", error: { code: 404, details: "Notification not found." }, meta: { timestamp: new Date().toISOString() } });
        // Ensure the user owns this notification
        if (notification.recipient_id !== user.id) {
            return res.status(403).json({ status: "error", message: "Forbidden: Not authorized to modify this notification.", error: { code: 403, details: "Forbidden: Not authorized to modify this notification." }, meta: { timestamp: new Date().toISOString() } });
        }
        return res.status(200).json({ status: "success", message: "Notification marked as read", data: notification, meta: { timestamp: new Date().toISOString() } });
    } catch (error) {
        console.error("Mark Notification As Read Error:", error);
        return res.status(500).json({ status: "error", message: "Server Error", error: { code: 500, details: error.message }, meta: { timestamp: new Date().toISOString() } });
    }
};

const deleteNotification = async (req, res) => {
    const { user } = req;
    const { id } = req.params; // Notification ID
    if (!user?.id) return res.status(401).json({ status: "error", message: "Unauthorized", error: { code: 401, details: "User not authenticated." }, meta: { timestamp: new Date().toISOString() } });

    try {
        // Need to retrieve notification first to check ownership
        const notification = await notificationModel.getNotificationById(id); // Assuming this function exists in model
        if (!notification) return res.status(404).json({ status: "error", message: "Notification not found.", error: { code: 404, details: "Notification not found." }, meta: { timestamp: new Date().toISOString() } });
        if (notification.recipient_id !== user.id) {
            return res.status(403).json({ status: "error", message: "Forbidden: Not authorized to delete this notification.", error: { code: 403, details: "Forbidden: Not authorized to delete this notification." }, meta: { timestamp: new Date().toISOString() } });
        }

        const rowCount = await notificationModel.deleteNotification(id);
        if (rowCount === 0) return res.status(404).json({ status: "error", message: "Notification not found or already deleted.", error: { code: 404, details: "Notification not found or already deleted." }, meta: { timestamp: new Date().toISOString() } });
        return res.status(200).json({ status: "success", message: "Notification deleted", data: null, meta: { timestamp: new Date().toISOString() } });
    } catch (error) {
        console.error("Delete Notification Error:", error);
        return res.status(500).json({ status: "error", message: "Server Error", error: { code: 500, details: error.message }, meta: { timestamp: new Date().toISOString() } });
    }
};

const setPreferences = async (req, res) => {
    const { user } = req;
    const { event_type, email_enabled, push_enabled } = req.body;
    if (!user?.id) return res.status(401).json({ status: "error", message: "Unauthorized", error: { code: 401, details: "User not authenticated." }, meta: { timestamp: new Date().toISOString() } });
    if (!event_type) return res.status(400).json({ status: "error", message: "Event type is required.", error: { code: 400, details: "Event type is required." }, meta: { timestamp: new Date().toISOString() } });

    try {
        const preferences = await notificationModel.setNotificationPreference({ user_id: user.id, event_type, email_enabled, push_enabled });
        return res.status(200).json({ status: "success", message: "Notification preferences updated", data: preferences, meta: { timestamp: new Date().toISOString() } });
    } catch (error) {
        console.error("Set Preferences Error:", error);
        return res.status(500).json({ status: "error", message: "Server Error", error: { code: 500, details: error.message }, meta: { timestamp: new Date().toISOString() } });
    }
};

const getPreferences = async (req, res) => {
    const { user } = req;
    if (!user?.id) return res.status(401).json({ status: "error", message: "Unauthorized", error: { code: 401, details: "User not authenticated." }, meta: { timestamp: new Date().toISOString() } });

    try {
        const preferences = await notificationModel.getNotificationPreferences(user.id);
        return res.status(200).json({ status: "success", message: "Notification preferences retrieved", data: preferences, meta: { timestamp: new Date().toISOString() } });
    } catch (error) {
        console.error("Get Preferences Error:", error);
        return res.status(500).json({ status: "error", message: "Server Error", error: { code: 500, details: error.message }, meta: { timestamp: new Date().toISOString() } });
    }
};


module.exports = {
    createNotification, // Internal use
    getNotifications,
    markAsRead,
    deleteNotification,
    setPreferences,
    getPreferences
};