const mongoose = require('mongoose');
const winston = require('winston');
//const debug = require('debug')('app:normal');

module.exports = () => {
  mongoose
    .connect('mongodb://localhost/videoplex', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
    .then(() => winston.info('connected to db 🎯'));
  //.then(() => debug('connected to db 🎯'));
};
