const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const debug = require('debug')('app:normal');

const app = express();

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
  debug('Morgan is Logging');
}

// ROUTE HANDLERS
app.use('/api/v1/genres', require('./routes/genres'));
app.use('/api/v1/customers', require('./routes/customers'));
app.use('/api/v1/movies', require('./routes/movies'));

app.get('/', (req, res) => {
  res.render('index', { message: 'Videoplex' });
});

// CONNECT DB
mongoose
  .connect('mongodb://localhost/videoplex', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => console.log('connected to db 🎯'))
  .catch(err => console.error('💥Error connecting to DB...'));

const port = process.env.PORT || 7000;
app.listen(port, () => console.log(`App is running at http://localhost:${port} 🚀`));
