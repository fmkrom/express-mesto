const router = require('express').Router();
const handleError = require('../utils/handleError');

router.get('*', (req, res) => {
  handleError(res, 404, 'Ресурс не найден');
});

module.exports = router;
