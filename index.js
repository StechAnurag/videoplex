const dotenv = require('dotenv').config({ path: '.env' });
const express = require('express');
const winston = require('winston');

const app = express();

// STARTUP REQUIREMENTS
require('./startup/logging')(app); //Logging handlers
require('./startup/config')(dotenv); // configuration and env vars
require('./startup/routes')(app); // route handlers
require('./startup/db')(); // db connection

const port = process.env.PORT || 7000;
app.listen(port, () => winston.info(`App is running at http://localhost:${port} 🚀`));
