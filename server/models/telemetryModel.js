const db = require('../config/db');

/**
 * ===============================================
 * GAME TELEMETRY MODEL — Player events & telemetry
 * ===============================================
 */

/**
 * Record a game telemetry event.
 *
 * @param {Object} params
 * @param {string} params.game_id - UUID of the game.
 * @param {string} [params.session_id] - UUID of the session.
 * @param {string} [params.user_id] - UUID of the user.
 * @param {string} params.event_type - Type of event.
 * @param {Object} [params.payload] - JSON payload with event data.
 * @returns {Promise<Object>} Newly inserted telemetry record.
 */
exports.addTelemetryEvent = async ({ game_id, session_id, user_id, event_type, payload }) => {
  const result = await db.query(`
    INSERT INTO analytics.game_telemetry (game_id, session_id, user_id, event_type, payload)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *
  `, [game_id, session_id, user_id, event_type, payload]);
  return result.rows[0];
};
