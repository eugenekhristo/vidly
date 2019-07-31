const config = require('config');

module.exports = () => {
  if (!config.get('secretKeyJwt')) {
    throw new Error(
      `[Fatal Error] Environment variable for 'secretKeyJwt' is not set!`
    );
  }
};
