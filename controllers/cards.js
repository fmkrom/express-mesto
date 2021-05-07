const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('user')
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: `При получении данных карточек произошла ошибка на сервере: ${err}` }))
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
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Переданы некорректные данные для создания карточки: ${err}` });
      } else {
        res.status(500).send({ message: `Ошибка на сервере: ${err}` });
      }
    })
    .catch(next);
};

/*
Примечание: функция поиска карточки по ID не требуется в брифе,
но создана для удобства работы с данными. В случае необходимости
могу ее закомментировать или удалить:
*/

module.exports.getCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new Error('NotFound'))
    .then((foundCard) => res.send({ foundCard }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: `Переданы некорректные данные для получения карточки: ${err}` });
      } else if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Ресурс не найден' });
      } else {
        res.status(500).send({ message: `Ошибка на сервере: ${err}` });
      }
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error('NotFound'))
    .then((deletedCard) => res.send({ deletedCard }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: `Переданы некорректные данные для удаления карточки: ${err}` });
      } else if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Ресурс не найден' });
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
  ).orFail(new Error('NotFound'))
    .then((likedCard) => res.send({ likedCard }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: `Переданы некорректные данные для лайка карточки: ${err}` });
      } else if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Ресурс не найден' });
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
  ).orFail(new Error('NotFound'))
    .then((dislikedCard) => res.send({ dislikedCard }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: `Переданы некорректные данные для дизлайка карточки: ${err}` });
      } else if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Ресурс не найден' });
      } else {
        res.status(500).send({ message: `При снятии лайка произошла ошибка на сервере: ${err}` });
      }
    })
    .catch(next);
};
