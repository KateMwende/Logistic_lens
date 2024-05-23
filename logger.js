const winston = require('winston');
const { combine, timestamp, json, prettyPrint, errors } = winston.format;

//logging errors setup
const logger = winston.createLogger({
    level: 'error',
    format: winston.format.combine(
      timestamp(),
      json(),
      prettyPrint(),
      errors({stack: true})
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({filename: 'logs.log', level: 'error'})
    ]
  })

module.exports = logger;