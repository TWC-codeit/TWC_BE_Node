const logger = require('../../config/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(`Error: ${err.message} - ${req.method} ${req.url}`);
  console.error(err.stack); // 콘솔 출력

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;