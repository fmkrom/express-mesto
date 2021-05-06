const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('user')
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(404).send({ message: `Данные карточек не найдены: ${err}` });
      } else {
        res.status(500).send({ message: `При получении данных карточек произошла ошибка на сервере: ${err}` });
      }
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const userId = req.user._id;
  // const{ name, link } = req.body;

  Card.create({
    name: req.body.name,
    link: req.body.link,
    owner: userId,
    likes: [],
    createdAt: Date.now(),
  })
    .then((card) => {
      res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: `Переданы некорректные данные для создания карточки: ${err}` });
      } else {
        res.status(500).send({ message: `Ошибка на сервере: ${err}` });
      }
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params.cardId;

  Card.findByIdAndDelete(cardId)
    .then((deletedCard) => res.send({ deletedCard }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: `Переданы некорректные данные для удаления карточки: ${err}` });
      } else if (err.name === 'NotFound') {
        res.status(404).send({ message: `Данные удаляемой карточки не найдены: ${err}` });
      } else {
        res.status(500).send({ message: `Ошибка на сервере: ${err}` });
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((likedCard) => res.send({ likedCard }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: `Переданы некорректные данные для лайка карточки: ${err}` });
      } else if (err.name === 'NotFound') {
        res.status(404).send({ message: `Данные карточки для постановки лайка не найдены: ${err}` });
      } else {
        res.status(500).send({ message: `При постановке лайка произошла ошибка на сервере: ${err}` });
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((dislikedCard) => res.send({ dislikedCard }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: `Переданы некорректные данные для дизлайка карточки: ${err}` });
      } else if (err.name === 'NotFound') {
        res.status(404).send({ message: `Данные карточки для снятия лайка не найдены: ${err}` });
      } else {
        res.status(500).send({ message: `При снятии лайка произошла ошибка на сервере: ${err}` });
      }
    })
    .catch(next);
};
