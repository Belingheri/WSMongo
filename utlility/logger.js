const winston = require("winston");
require("winston-daily-rotate-file");

const { combine, timestamp, json } = winston.format;

winston.exceptions.handle([
  new winston.transports.DailyRotateFile({
    filename: "log/ERROR-%DATE%.json",
    datePattern: "YYYY-MM-DD-HH",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
  }),
  new winston.transports.Console({ format: winston.format.simple() }),
]);

const transports = [
  new winston.transports.Console({
    format: winston.format.simple(),
    timestamp: true,
  }),
];

if (process.env.NODE_ENV === "production") {
  transports.push(
    new winston.transports.DailyRotateFile({
      filename: "log/info-%DATE%.json",
      datePattern: "YYYY-MM-DD-HH",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      level: "info",
      timestamp: true,
    }),
    new winston.transports.DailyRotateFile({
      filename: "log/error-%DATE%.json",
      datePattern: "YYYY-MM-DD-HH",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "30d",
      level: "error",
      timestamp: true,
    })
  );
}

const logger = new winston.createLogger({
  format: combine(timestamp(), json()),
  transports: transports,
});

module.exports = logger;
