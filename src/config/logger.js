const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ level, message, timestamp }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`)
  ),
  transports: [
    new transports.Console(), // 콘솔에 출력
    new transports.File({ filename: 'logs/error.log', level: 'error' }), // 파일로 저장
  ],
});

module.exports = logger;
