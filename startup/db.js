const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');
//const debug = require('debug')('app:normal');

module.exports = () => {
  const db = config.get('db');
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
    .then(() => winston.info(`connected to ${db.substring(db.lastIndexOf('/') + 1)} DB 🎯`));
  //.then(() => debug('connected to db 🎯'));
};
