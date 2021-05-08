const Card = require('../models/card');

function handleErr(err, res) {
  if (err.name === 'CastError') {
    res.status(400).send({ message: `Переданы некорректные данные: ${err}` });
  } else if (err.message === 'NotFound') {
    res.status(404).send({ message: 'Ресурс не найден' });
  } else {
    res.status(500).send({ message: `Произошла ошибка на сервере: ${err}` });
  }
}

// Основные функции работы с запросами:
async function getCards(req, res, next) {
  try {
    await Card.find({})
      .populate('user')
      .then((cards) => res.send({ data: cards }));
  } catch (err) {
    res.status(500).send({ message: `При получении данных карточек произошла ошибка на сервере: ${err}` });
  }
  next();
}

async function createCard(req, res, next) {
  try {
    await Card.create({
      name: req.body.name,
      link: req.body.link,
      owner: req.user._id,
      likes: [],
      createdAt: Date.now(),
    })
      .then((card) => { res.send({ card }); });
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: `Переданы некорректные данные для создания карточки: ${err}` });
    } else {
      res.status(500).send({ message: `Ошибка на сервере: ${err}` });
    }
  }
  next();
}

/*
Примечание: функция поиска карточки по ID не требуется в брифе,
но создана для удобства работы с данными. В случае необходимости
могу ее закомментировать или удалить:
*/

async function getCardById(req, res, next) {
  try {
    await Card.findById(req.params.cardId)
      .orFail(new Error('NotFound'))
      .then((foundCard) => res.send({ foundCard }));
  } catch (err) {
    handleErr(err, res);
  }
  next();
}

async function deleteCard(req, res, next) {
  try {
    await Card.findByIdAndRemove(req.params.cardId)
      .orFail(new Error('NotFound'))
      .then((deletedCard) => res.send({ deletedCard }));
  } catch (err) {
    handleErr(err, res);
  }
  next();
}

async function likeCard(req, res, next) {
  try {
    await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).orFail(new Error('NotFound'))
      .then((likedCard) => res.send({ likedCard }));
  } catch (err) {
    handleErr(err, res);
  }
  next();
}

async function dislikeCard(req, res, next) {
  try {
    await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    ).orFail(new Error('NotFound'))
      .then((dislikedCard) => res.send({ dislikedCard }));
  } catch (err) {
    handleErr(err, res);
  }
  next();
}

module.exports = {
  getCards,
  createCard,
  getCardById,
  deleteCard,
  likeCard,
  dislikeCard,
};
