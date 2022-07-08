const winston = require("winston");

const consoleTransport = new winston.transports.Console();
const fileTransport = new winston.transports.File({
  filename: "logs.log",
  level: "error",
});
const transports = [consoleTransport, fileTransport];
const winstonLogger = winston.createLogger({
  transports,
  level: "debug",
  handleExceptions: true,
});

console.log = (message) => winstonLogger.info(message);
console.error = (message) =>
  winstonLogger.error(message || JSON.stringify(message));
console.debug = (message) => winstonLogger.debug(message);
console.info = (message) => winstonLogger.info(message);
console.table = (message) => winstonLogger.info(message);
console.warn = (message) => winstonLogger.warn(message);
