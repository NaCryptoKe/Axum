const AnalyticsModel = require('../models/analyticsModel');
const { successResponse, errorResponse } = require('../utils/responseHandler');

/**
 * Records a new telemetry event.
 */
const recordTelemetryEvent = async (req, res) => {
    try {
        // NOTE: The database schema for `analytics.game_telemetry` requires a `BIGINT` for the `id`.
        // Using `Date.now()` is a simple way to generate a large integer, but it is NOT guaranteed to be unique,
        // especially under high load. For a production system, a more robust distributed unique ID generator
        // like a Snowflake ID should be implemented.
        const id = Date.now();

        const newEvent = await AnalyticsModel.createTelemetryEvent(id, req.body);
        return successResponse(res, newEvent, 201); // 201 Created
    } catch (error) {
        console.error('Error recording telemetry event:', error);
        // Check for specific errors, like missing required fields
        if (error.code === '23502') { // not_null_violation
            return errorResponse(res, `Failed to record telemetry event: Missing required field '${error.column}'.`, 400, 'VALIDATION_ERROR');
        }
        return errorResponse(res, 'Failed to record telemetry event.', 500);
    }
};

module.exports = {
    recordTelemetryEvent,
};
