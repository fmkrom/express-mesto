const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
  getCardById,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
}), createCard);

router.get('/:cardId', getCardById);
router.delete('/:cardId', deleteCard);

router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
