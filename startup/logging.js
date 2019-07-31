require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
const path = require('path');

module.exports = () => {
  winston.exceptions.handle(
    new winston.transports.File({
      filename: path.resolve(__dirname, '..', 'logs', 'exceptions.log'),
      exitOnError: true
    }),
    new winston.transports.Console({
      colorize: true,
      prettyPrint: true
    })
  );

  process.on('unhandledRejection', error => {
    throw error;
  });

  winston.add(
    new winston.transports.Console({
      colorize: true,
      prettyPrint: true
    })
  );
  winston.add(
    new winston.transports.File({
      filename: path.resolve(__dirname, '..', 'logs', 'loginfo.log')
    })
  );
  winston.add(
    new winston.transports.MongoDB({
      db: 'mongodb://localhost/vidly',
      level: 'error'
    })
  );
};
