const logger = require('../utils/logger');

const errorHandler = (err, req, res, _next) => {
  logger.error(`${err.message}`, err.stack ? `\n${err.stack}` : '');

  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'Internal server error'
      : err.message || 'Something went wrong';

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};

module.exports = errorHandler;
