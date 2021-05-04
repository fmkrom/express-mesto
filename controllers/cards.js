const { ModuleFilenameHelpers } = require('webpack');
const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('user')
    .then(cards => res.send({ data: cards }))
    .catch(err => res.status(500).send({ message: `Данные карточек не найдены: ${err.message}` }));
};

module.exports.createCard = (req, res, next) => {
    const userId = req.user._id;
    const{ name, link } = req.body;
    
    Card.create({ 
            name: req.body.name, 
            link: req.body.link,
            owner: userId,
            likes: [],
            createdAt: Date.now()
          })
        .then(card =>{
            console.log('This is New Card:', card);
            res.send({ card });
        })
        .catch(err => res.status(500).send({ message:`Ошибка создания карточки: ${err.message}`}))
        .catch(next);
}; 

module.exports.deleteCard = (req, res, next) => {
  const cardId = req.params.cardId;

  Card.findByIdAndDelete(cardId)
  .then(deletedCard => res.send({deletedCard}))
  .catch((err) => res.status(500).send({ message: `Ошибка удаления карточки: ${err}`}))
  .catch(next);
};

module.exports.likeCard = (req, res, next) =>{
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, 
    { new: true })
  .then(likedCard => res.send({likedCard}))
  .catch((err) => res.status(500).send({ message: `Ошибка лайка карточки: ${err}`}))
  .catch(next);
};
 
  
module.exports.dislikeCard = (req, res, next) =>{
  Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, 
  { new: true })
  .then(dislikedCard => res.send({dislikedCard}))
  .catch((err) => res.status(500).send({ message: `Ошибка дизлайка карточки: ${err}`}))
  .catch(next);  
}; 

