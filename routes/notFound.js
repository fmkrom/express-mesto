const router = require('express').Router();
const { handleNotFoundError } = require('../utils/utils');

router.get('*', (req, res) => {
  handleNotFoundError(res, 404, 'Ресурс не найден');
});

module.exports = router;
