const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');

const { UnauthorizedError } = require('../errors/401-UnauthorizedError');

function handleAuthorization(req, res, next) {
  const token = req.cookies.userToken;
  if (!token) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new UnauthorizedError(`Передан некорректный токен: ${err}`);
  }
  req.user = payload;

  next();
}

module.exports = { handleAuthorization };
