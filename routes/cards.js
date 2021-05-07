const router = require('express').Router();
const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
  getCardById,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);

/*
Примечание: рут для поиска карточки по ID не требуется в брифе,
но создан для удобства работы с данными. В случае необходимости
могу его закомментировать или удалить:
*/
router.get('/:cardId', getCardById);
router.delete('/:cardId', deleteCard);

router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
