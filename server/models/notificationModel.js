const pool = require('../config/db');

const createNotification = async ({
    recipient_id,
    actor_id,
    type,
    data
}) => {
    const { rows } = await pool.query(
        `INSERT INTO notifications.items
        (recipient_id, actor_id, type, data)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [recipient_id, actor_id, type, data]
    );
    return rows[0];
};

const getNotificationsByRecipient = async (recipient_id, is_read = false) => {
    const { rows } = await pool.query(
        'SELECT * FROM notifications.items WHERE recipient_id = $1 AND is_read = $2 ORDER BY created_at DESC',
        [recipient_id, is_read]
    );
    return rows;
};

const markNotificationAsRead = async (id) => {
    const { rows } = await pool.query(
        'UPDATE notifications.items SET is_read = true, read_at = NOW() WHERE id = $1 RETURNING *',
        [id]
    );
    return rows[0];
};

const deleteNotification = async (id) => {
    const result = await pool.query(
        'DELETE FROM notifications.items WHERE id = $1',
        [id]
    );
    return result.rowCount;
};

const setNotificationPreference = async ({ user_id, event_type, email_enabled, push_enabled }) => {
    const { rows } = await pool.query(
        `INSERT INTO notifications.preferences
        (user_id, event_type, email_enabled, push_enabled)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id, event_type) DO UPDATE
        SET email_enabled = EXCLUDED.email_enabled,
            push_enabled = EXCLUDED.push_enabled
        RETURNING *`,
        [user_id, event_type, email_enabled, push_enabled]
    );
    return rows[0];
};

const getNotificationPreferences = async (user_id) => {
    const { rows } = await pool.query(
        'SELECT * FROM notifications.preferences WHERE user_id = $1',
        [user_id]
    );
    return rows;
};

const getNotificationPreference = async (user_id, event_type) => {
    const { rows } = await pool.query(
        'SELECT * FROM notifications.preferences WHERE user_id = $1 AND event_type = $2',
        [user_id, event_type]
    );
    return rows[0];
};

module.exports = {
    createNotification,
    getNotificationsByRecipient,
    markNotificationAsRead,
    deleteNotification,
    setNotificationPreference,
    getNotificationPreferences,
    getNotificationPreference
};