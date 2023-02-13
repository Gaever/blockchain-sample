import _isEmpty from 'lodash/isEmpty';
import winston from 'winston';

const myFormat = winston.format.printf(({ level, message, label, timestamp, ...rest }) => {
  return `${process.env.SERVICE_NAME ? `[${process.env.SERVICE_NAME}] ` : ''}${timestamp}${label ? ` [${label}] ` : ' '}${level}: ${message} ${
    _isEmpty(rest) ? '' : JSON.stringify(rest)
  }`;
});

const log = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.splat(), winston.format.simple(), myFormat),
  transports: [new winston.transports.Console({})],
});

export { log };
