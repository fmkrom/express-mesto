const router = require('express').Router();
const { createCard, getCards, deleteCard } = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);

module.exports = router; 

//60917da60d97405eb41adf5c