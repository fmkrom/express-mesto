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
    
    console.log('This is request body:', req.body);
    
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
        .catch(err => res.status(500).send({ message:`${err.message}`}))
        //${res.name}, ${res.link}, ${res.owner}. Ошибка создания карточки. Имя карточки: ${req.body.name}, Ссылка: ${req.body.link}, Пользователь: ${userId}` }))
        .catch(next); 
}; 

module.exports.deleteCard = (req, res, next) => {
  
  console.log('This is req.params:', req.params.cardId);
  
  const cardId = req.params.cardId;

  console.log('This is carId:', cardId);
  
  Card.findByIdAndDelete(cardId)
  .then(deletedCard => res.send({deletedCard}))
  .catch(() => res.status(500).send({ message: `Ошибка удаления карточки`}))
  .catch(next);
}

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, 
  { new: true },
)
  
module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, 
  { new: true },
) 
