const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  console.log('Authorization headers: ', authorization);

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(401)
      .send({ message: `Необходима авторизация: отсутствует токен. Запрос: ${req}. Результат: ${res}` });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }
  req.user = payload;

  console.log(token);
  console.log(payload);
  console.log(req.user);

  next();
};
