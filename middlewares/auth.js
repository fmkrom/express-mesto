const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const {
  handleAuthorizationError,
} = require('../utils/utils');

function handleAuthorization(req, res, next) {
  const token = req.cookies.userToken;
  if (!token) { handleAuthorizationError(res); }

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    handleAuthorizationError(res);
  }
  req.user = payload;

  next();
}

module.exports = { handleAuthorization };
