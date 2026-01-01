const pool = require('../config/db');

/**
 * Creates a new game telemetry event.
 * This table is partitioned, so inserts should be fast.
 * @param {object} event - The event data.
 * @param {bigint} event.id - A unique ID for the event.
 * @param {string} event.game_id - The ID of the game.
 * @param {string} [event.session_id] - The session ID.
 * @param {string} [event.user_id] - The user ID.
 * @param {string} event.event_type - The type of event.
 * @param {object} [event.payload] - The event payload (JSONB).
 * @param {Date} [event.timestamp] - The timestamp of the event.
 * @returns {Promise<object>} The created event data.
 */
const createGameTelemetryEvent = async ({ id, game_id, session_id, user_id, event_type, payload, timestamp }) => {
    const query = `
        INSERT INTO analytics.game_telemetry (id, game_id, session_id, user_id, event_type, payload, timestamp)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;
    const values = [id, game_id, session_id, user_id, event_type, payload, timestamp || new Date()];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

/**
 * Retrieves game telemetry events for a specific game.
 * @param {string} game_id - The ID of the game.
 * @param {Date} [startDate] - The start date for the time range.
 * @param {Date} [endDate] - The end date for the time range.
 * @param {number} [limit=100] - The maximum number of events to return.
 * @returns {Promise<Array<object>>} A list of game telemetry events.
 */
const getGameTelemetryByGame = async (game_id, startDate, endDate, limit = 100) => {
    let query = 'SELECT * FROM analytics.game_telemetry WHERE game_id = $1';
    const values = [game_id];
    let paramIndex = 2;

    if (startDate) {
        query += ` AND timestamp >= $${paramIndex++}`;
        values.push(startDate);
    }
    if (endDate) {
        query += ` AND timestamp <= $${paramIndex++}`;
        values.push(endDate);
    }

    query += ` ORDER BY timestamp DESC LIMIT $${paramIndex}`;
    values.push(limit);

    const { rows } = await pool.query(query, values);
    return rows;
};


module.exports = {
    createGameTelemetryEvent,
    getGameTelemetryByGame,
};
