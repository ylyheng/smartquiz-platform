const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let details = err.details || null;

  if (!(err instanceof ApiError)) {
    logger.error('Unhandled error:', err);
    statusCode = 500;
    message = 'Internal Server Error';
  }

  const response = { success: false, message };
  if (details) response.details = details;
  if (process.env.NODE_ENV === 'development') response.stack = err.stack;

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
