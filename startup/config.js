const config = require('config');

module.exports = dotenv => {
  // check for environment variables
  if (dotenv.error || !config.get('jwtPrivateKey')) {
    throw new Error('💥ERROR: setting environment variables');
  }
};
