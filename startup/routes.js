const express = require('express');
const errorHandler = require('../middlewares/error');

module.exports = function (app) {
  // SETTING VIEWS
  app.use(express.static('public'));
  app.set('view engine', 'pug');
  app.set('views', '../views');

  // BODY PARSING
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/api/v1/genres', require('../routes/genres'));
  app.use('/api/v1/customers', require('../routes/customers'));
  app.use('/api/v1/movies', require('../routes/movies'));
  app.use('/api/v1/rentals', require('../routes/rentals'));
  app.use('/api/v1/users', require('../routes/users'));
  app.use('/api/v1/auth', require('../routes/auth'));

  app.get('/', (req, res) => {
    res.render('index', { message: 'Videoplex' });
  });

  app.all('*', (req, res) => res.send('404 Not Found'));

  // Error handling in Express
  app.use(errorHandler);
};
