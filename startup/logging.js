const winston = require('winston');
const morgan = require('morgan');
require('winston-mongodb');
require('express-async-errors');

module.exports = function (app) {
  // Development Logging
  if (process.env.NODE_ENV === 'development' || app.get('env') === 'development') {
    app.use(morgan('tiny'));
  }
  winston.handleExceptions(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: '../logs/uncaughtException.log' })
  );
  process.on('unhandledRejection', err => {
    throw err;
  });

  //configuring the winston logger
  winston.add(winston.transports.File, { filename: '../logs/logfile.log', level: 'warn' });
  winston.add(winston.transports.MongoDB, { db: 'mongodb://localhost/videoplex', level: 'error' });
  //winston.remove(winston.transports.Console);
};
