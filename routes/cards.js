const router = require('express').Router();
const { createCard, getCards } = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);

module.exports = router; 