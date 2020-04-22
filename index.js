const express = require('express');
const morgan = require('morgan');
const config = require('config');
const debug = require('debug')('app:normal');
const debugDB = require('debug')('app:db');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log('App Name: ' + config.get('name'));
console.log('Mail server: ' + config.get('mail.host'));
console.log('Mail Password: ' + config.get('mail.password'));

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  debug('Morgan is Logging');
}

app.get('/', (req, res) => {
  res.render('index', { message: 'Videoplex' });
  // res.send('Welcome to videoplex');
});

debugDB('Connected to Database..');

const port = process.env.PORT || 7000;
app.listen(port, () => console.log(`App is running at http://localhost:${port} 🚀`));
