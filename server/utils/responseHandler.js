// utils/responseHandler.js

const getErrorType = (statusCode) => {
    if (statusCode >= 500) return 'Internal Server Error';
    if (statusCode === 429) return 'Too Many Requests';
    if (statusCode === 404) return 'Not Found';
    if (statusCode === 403) return 'Forbidden';
    if (statusCode === 401) return 'Unauthorized';
    if (statusCode >= 400) return 'Bad Request';
    return 'Unknown Error';
}

/**
 * Sends a standardized success response.
 * @param {object} res - The Express response object.
 * @param {object|array} data - The payload to send.
 * @param {number} [statusCode=200] - The HTTP status code.
 * @param {object} [pagination=null] - Pagination info for list responses.
 */
const successResponse = (res, data, statusCode = 200, pagination = null) => {
  const response = {
    status: 'success',
    data,
  };
  if (pagination) {
    response.pagination = pagination;
  }
  // TODO: Add meta field with request_id and timestamp
  return res.status(statusCode).json(response);
};

/**
 * Sends a standardized error response.
 * @param {object} res - The Express response object.
 * @param {string} message - A human-readable error message.
 * @param {number} [statusCode=500] - The HTTP status code.
 * @param {string} [errorCode=null] - A machine-readable error code.
 * @param {string} [details=null] - More detailed error information.
 * @param {object} [fields=null] - For validation errors, an object of field-specific errors.
 */
const errorResponse = (res, message, statusCode = 500, errorCode = null, details = null, fields = null) => {
  const errorPayload = {
    code: errorCode || getErrorType(statusCode).toUpperCase().replace(/ /g, '_'),
    type: getErrorType(statusCode),
  };

  if (details) {
    errorPayload.details = details;
  }
  if (fields) {
    errorPayload.fields = fields;
  }

  return res.status(statusCode).json({
    status: 'error',
    message,
    error: errorPayload,
  });
};

module.exports = {
  successResponse,
  errorResponse,
};
