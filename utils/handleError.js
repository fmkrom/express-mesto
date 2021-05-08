function handleError(res, ERROR_CODE, message) {
  res.status(ERROR_CODE).send({ message });
}

module.exports = handleError;
