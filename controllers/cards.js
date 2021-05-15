const Card = require('../models/card');
const { handleErr } = require('../utils/utils');

const { BadRequestError } = require('../errors/400-BadRequestError');
const { NotFoundError } = require('../errors/404-NotFoundError');
const { InternalServerError } = require('../errors/500-InternalServerError');
const { ForbiddenError } = require('../errors/403-ForbiddenError');

function getCards(req, res, next) {
  Card.find({})
    .populate('user')
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      throw new InternalServerError(`Ошибка на сервере: ${err}`);
    })
    .catch(next);
}

function createCard(req, res, next) {
  Card.create({
    name: req.body.name,
    link: req.body.link,
    owner: req.user._id,
    likes: [],
    createdAt: Date.now(),
  })
    .then((card) => { res.send({ card }); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные для создания карточки');
      } else {
        throw new InternalServerError('Ошибка на сервере');
      }
    })
    .catch(next);
}

function getCardById(req, res, next) {
  Card.findById(req.params.cardId)
    .orFail(new Error('NotFound'))
    .then((foundCard) => res.send({ foundCard }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        throw new NotFoundError('Данные карточки не найдены');
      } else {
        throw new InternalServerError('Произошла ошибка на сервере');
      }
    })
    .catch(next);
}

function deleteCard(req, res, next) {
  Card.findById(req.params.cardId)
    .orFail(new Error('NotFound'))
    .then((card) => {
      const isOwn = Boolean(card.owner == req.user._id);

      if (!isOwn) {
        throw new ForbiddenError('У пользователя нет прав для удаления данной карточки');
      } else if (isOwn) {
        Card.findByIdAndRemove(card._id)
          .then((deletedCard) => res.send({ deletedCard }))
          .catch((err) => handleErr(err));
      }
    })
    .catch((err) => handleErr(err))
    .catch(next);
}

function likeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail(new Error('NotFound'))
    .then((likedCard) => res.send({ likedCard }))
    .catch((err) => handleErr(err))
    .catch(next);
}

function dislikeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail(new Error('NotFound'))
    .then((dislikedCard) => res.send({ dislikedCard }))
    .catch((err) => handleErr(err))
    .catch(next);
}

module.exports = {
  getCards,
  createCard,
  getCardById,
  deleteCard,
  likeCard,
  dislikeCard,
};
