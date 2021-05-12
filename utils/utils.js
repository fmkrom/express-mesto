function handleNotFoundError(res, ERROR_CODE, message) {
  res
    .status(ERROR_CODE)
    .send({ message });
}

function handleAuthorizationError(res) {
  return res
    .status(401)
    .send({ message: `Необходима авторизация. Результат: ${res}` });
}

module.exports = { handleNotFoundError, handleAuthorizationError };
