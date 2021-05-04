const { ModuleFilenameHelpers } = require('webpack');
const User = require('../models/user');

module.exports.getUsers = (req, res, next) =>{
    User.find({})
    .then(users => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: `Ошибка получения списка пользователей`}))
    .catch(next);
}

module.exports.getUserById = (req, res, next) =>{
    const userId = req.user._id;

    User.findById(userId)
        .then(user => res.send({user}))
        .catch(() => res.status(500).send({ message: `Ошибка поиска пользователя по Id`}))
        .catch(next);
};

module.exports.createUser = (req, res, next) =>{
    const{ name, about, avatar } = req.body;

    User.create({ name: req.body.name, about: req.body.about, avatar: req.body.avatar })
    .then(user => res.send({ name: user.name, about: user.about, avatar: user.avatar}))
    .catch(() => res.status(500).send({ message: `Error creating user` }))
    .catch(next);
}

module.exports.updateUserProfile = (req, res, next) =>{
    const userId = req.user._id;
    const {name, about} = req.body;

    User.findByIdAndUpdate(userId, {name: name, about: about}, {new: true})
    .then((user)=> res.send({user}))
    .catch((err) =>res.status(500).send({ message: `Ошибка обновления профиля: ${err}` }))
    .catch(next);
};


