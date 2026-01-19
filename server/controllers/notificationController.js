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
    if (!user?.id) return res.status(401).json({ success: false, message: "Unauthorized" });

    try {
        const notifications = await notificationModel.getNotificationsByRecipient(user.id, false); // Get unread by default
        return res.status(200).json({ success: true, message: "Notifications retrieved", data: notifications });
    } catch (error) {
        console.error("Get Notifications Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const markAsRead = async (req, res) => {
    const { user } = req;
    const { id } = req.params; // Notification ID
    if (!user?.id) return res.status(401).json({ success: false, message: "Unauthorized" });

    try {
        const notification = await notificationModel.markNotificationAsRead(id);
        if (!notification) return res.status(404).json({ success: false, message: "Notification not found." });
        // Ensure the user owns this notification
        if (notification.recipient_id !== user.id) {
            return res.status(403).json({ success: false, message: "Forbidden: Not authorized to modify this notification." });
        }
        return res.status(200).json({ success: true, message: "Notification marked as read", data: notification });
    } catch (error) {
        console.error("Mark Notification As Read Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const deleteNotification = async (req, res) => {
    const { user } = req;
    const { id } = req.params; // Notification ID
    if (!user?.id) return res.status(401).json({ success: false, message: "Unauthorized" });

    try {
        // Need to retrieve notification first to check ownership
        const notification = await notificationModel.getNotificationById(id); // Assuming this function exists in model
        if (!notification) return res.status(404).json({ success: false, message: "Notification not found." });
        if (notification.recipient_id !== user.id) {
            return res.status(403).json({ success: false, message: "Forbidden: Not authorized to delete this notification." });
        }

        const rowCount = await notificationModel.deleteNotification(id);
        if (rowCount === 0) return res.status(404).json({ success: false, message: "Notification not found or already deleted." });
        return res.status(200).json({ success: true, message: "Notification deleted" });
    } catch (error) {
        console.error("Delete Notification Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const setPreferences = async (req, res) => {
    const { user } = req;
    const { event_type, email_enabled, push_enabled } = req.body;
    if (!user?.id) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!event_type) return res.status(400).json({ success: false, message: "Event type is required." });

    try {
        const preferences = await notificationModel.setNotificationPreference({ user_id: user.id, event_type, email_enabled, push_enabled });
        return res.status(200).json({ success: true, message: "Notification preferences updated", data: preferences });
    } catch (error) {
        console.error("Set Preferences Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getPreferences = async (req, res) => {
    const { user } = req;
    if (!user?.id) return res.status(401).json({ success: false, message: "Unauthorized" });

    try {
        const preferences = await notificationModel.getNotificationPreferences(user.id);
        return res.status(200).json({ success: true, message: "Notification preferences retrieved", data: preferences });
    } catch (error) {
        console.error("Get Preferences Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
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