import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let details = err.details || null;

  if (!(err instanceof ApiError)) {
    logger.error('Unhandled error:', err);
    statusCode = 500;
    if (process.env.NODE_ENV === 'development') {
      message = err.message;
    } else {
      message = 'Internal Server Error';
    }
  }

  const response = { success: false, message };
  if (details) response.details = details;
  if (process.env.NODE_ENV === 'development') response.stack = err.stack;

  res.status(statusCode).json(response);
};

export default errorHandler;
