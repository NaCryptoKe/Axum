const pool = require('../config/db');

/**
 * Creates a new telemetry event in the database.
 * @param {bigint} id - A unique identifier for the event. This is required by the database schema.
 * @param {object} eventData - The telemetry event data.
 * @param {string} eventData.game_id - The UUID of the game.
 * @param {string} [eventData.session_id] - The UUID of the game session.
 * @param {string} [eventData.user_id] - The UUID of the user.
 * @param {string} eventData.event_type - The type of the event.
 * @param {object} [eventData.payload] - The JSON payload for the event.
 * @returns {Promise<object>} The newly created event record.
 */
const createTelemetryEvent = async (id, { game_id, session_id, user_id, event_type, payload }) => {
    const result = await pool.query(
        `INSERT INTO analytics.game_telemetry (id, game_id, session_id, user_id, event_type, payload)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [id, game_id, session_id, user_id, event_type, payload]
    );
    return result.rows[0];
};

module.exports = {
    createTelemetryEvent,
};