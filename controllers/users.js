const { ModuleFilenameHelpers } = require('webpack');
const User = require('../models/user');

module.exports.getUsers = (req, res, next) =>{
    User.find({})
    .then(users => res.send({ data: users }))
    .catch(() =>{
        if (err.name === 'NotFound') {
            res.status(404).send({ message: `Данные пользователей не найдены: ${err}` })    
        } else {
            res.status(500).send({ message: `При поиске данных пользователей произошла ошибка на сервере: ${err}` })    
        }
    }).catch(next);
}

module.exports.getUserById = (req, res, next) =>{
    const userId = req.user._id;

    User.findById(userId)
        .then(user => res.send({user}))
        .catch((err) => {
            if (err.name === 'NotFound') {
                res.status(404).send({ message: `Пользователь с такими данными не найден: ${err}` })    
            } else {
                res.status(500).send({ message: `При поиске пользователя произошла ошибка на сервере: ${err}` })    
            }
        })
        .catch(next);
};

module.exports.createUser = (req, res, next) =>{
    const{ name, about, avatar } = req.body;

    User.create({ name: req.body.name, about: req.body.about, avatar: req.body.avatar })
    .then(user => res.send({ name: user.name, about: user.about, avatar: user.avatar}))
    .catch((err) => {
        if (err.name === 'CastError') {
            res.status(400).send({ message: `Переданы некорректные данные для создания пользователя: ${err}` })    
        } else {
            res.status(500).send({ message: `При создании пользователя произошла ошибка на сервере: ${err}` })    
        }
    })
    .catch(next);
}

module.exports.updateUserProfile = (req, res, next) =>{
    const userId = req.user._id;
    const {name, about} = req.body;

    User.findByIdAndUpdate(userId, {name: name, about: about}, {new: true})
    .then((updatedUser)=> res.send({updatedUser}))
    .catch((err) =>{
        if (err.name === 'CastError') {
            res.status(400).send({ message: `Переданы некорректные данные для обновления профиля: ${err}` })    
        } else if (err.name === 'NotFound') {
            res.status(404).send({ message: `Пользователь с такими данными не найден: ${err}` })    
        } else {
            res.status(500).send({ message: `При обновлении профиля пользователя произошла ошибка на сервере: ${err}` })    
        }
    })
    .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) =>{
    const userId = req.user._id;
    const {avatar} = req.body;

    User.findByIdAndUpdate(userId, { avatar: avatar }, {new: true})
    .then((updatedUser)=> res.send({updatedUser}))
    .catch((err) =>{
        if (err.name === 'CastError') {
            res.status(400).send({ message: `Переданы некорректные данные для обновления аватара: ${err}` })    
        } else if (err.name === 'NotFound') {
            res.status(404).send({ message: `Пользователь с таким аватаром не найден: ${err}` })    
        } else {
            res.status(500).send({ message: `При обновлении аватара произошла ошибка на сервере: ${err}` })    
        }
    }).catch(next);
};

