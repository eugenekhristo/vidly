const jwt = require('jsonwebtoken');
const config = require('config');

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied! No token provided!');

  try {
    const decodedUser = jwt.verify(token, config.get('secretKeyJwt'));
    req.user = decodedUser;
    next();
  } catch (error) {
    res.status(400).send('Invalid token!');
  }
};

module.exports = auth;
