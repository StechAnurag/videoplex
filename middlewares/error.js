const winston = require('winston');

module.exports = (err, req, res, next) => {
  // Log the exception
  // winston.log('error', err.message, err);
  winston.error(err.message, err);
  // error 0
  // warn  1
  // info  2
  // verbose 3
  // debug 4
  // silly 5
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong'
  });
};
