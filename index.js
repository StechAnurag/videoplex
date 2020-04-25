const dotenv = require('dotenv').config({ path: '.env' });
require('express-async-errors'); // handle async error without try catch in express
const config = require('config');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const debug = require('debug')('app:normal');
const errorHandler = require('./middlewares/error');
const winston = require('winston');
require('winston-mongodb');

const app = express();

// ERROR Handling: outside the express
/* process.on('uncaughtException', err => { // handling errors in synchronous code
  console.log('UNCAUGHT EXCEPTION💥');
  winston.error(err.message, err);
  process.exit(1);
}); */
// configuring a different transport for synchronous error

winston.handleExceptions(new winston.transports.File({ filename: 'uncaughtException.log' }));

process.on('unhandledRejection', err => {
  // handling errors in asynchronous code
  throw err; // winston will catch this exception, so we can rely on it rather than commented implementation
});
/* process.on('unhandledRejection', err => {
  // handling errors in asynchronous code
  console.log('UNHANDLED REJECTION💥');
  winston.error(err.message, err);
  process.exit(1);
}); */

// check for environment variables
if (dotenv.error || !config.get('jwtPrivateKey')) {
  debug('💥ERROR: setting environment variables');
  process.exit(1);
}

//configuring the winston logger
winston.add(winston.transports.File, { filename: 'logfile.log' });
winston.add(winston.transports.MongoDB, { db: 'mongodb://localhost/videoplex', level: 'error' });
// only log error level errors to the database. warn , info and below that not be stored
winston.remove(winston.transports.Console);

// SETTING VIEWS
app.use(express.static('public'));
app.set('view engine', 'pug');
app.set('views', './views');

// BODY PARSING
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// LOGGING
if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
}

// ROUTE HANDLERS
app.use('/api/v1/genres', require('./routes/genres'));
app.use('/api/v1/customers', require('./routes/customers'));
app.use('/api/v1/movies', require('./routes/movies'));
app.use('/api/v1/rentals', require('./routes/rentals'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/auth', require('./routes/auth'));

app.get('/', (req, res) => {
  res.render('index', { message: 'Videoplex' });
});

// Error handling in Express
app.use(errorHandler);

// simulating an uncaughtExeption
//throw new Error('Somthing failed during app startup');
// simulating an unhandledRejection
/* const p = Promise.reject(new Error('Something failed miserably'));
p.then(()=>console.log('Done')); */

// CONNECT DB
mongoose
  .connect('mongodb://localhost/videoplex', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => debug('connected to db 🎯'))
  .catch(err => console.error('💥Error connecting to DB...'));

const port = process.env.PORT || 7000;
app.listen(port, () => debug(`App is running at http://localhost:${port} 🚀`));
