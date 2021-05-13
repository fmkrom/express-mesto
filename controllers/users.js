const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

function handleErr(err, res) {
  if (err.name === 'CastError') {
    res.status(400).send({ message: `Переданы некорректные данные: ${err}` });
  } else if (err.message === 'NotFound') {
    res.status(404).send({ message: 'Ресурс не найден' });
  } else {
    res.status(500).send({ message: `Произошла ошибка на сервере: ${err}` });
  }
}

async function getUsers(req, res, next) {
  try {
    await User.find({})
      .then((users) => res.send({ data: users }));
  } catch (err) {
    res.status(500).send({ message: `При поиске данных пользователей произошла ошибка на сервере: ${err}` });
  }
  next();
}

async function createUser(req, res, next) {
  try {
    await bcrypt.hash(req.body.password, 10)
      .then((hash) => {
        User.create({
          name: req.body.name,
          about: req.body.about,
          avatar: req.body.avatar,
          email: req.body.email,
          password: hash,
        })
          .then((user) => res.status(201).send({
            id: user._id,
            email: user.email,
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            password: user.password,
          }));
      });
    return; // Всегда нужно в конце блока try использовать return!
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: `Переданы некорректные данные для создания пользователя: ${err}` });
    } else if (err.name === 'NotFound') {
      res.status(404).send({ message: `Ошибка создания пользователя: Запрос: ${req}, Ошибка: ${err}` });
    } else {
      res.status(500).send({ message: `При создании пользователя произошла ошибка на сервере: ${err}` });
    }
  }
  next();
}

async function login(req, res, next) {
  try {
    await User.findUserByCredentials(req.body.email, req.body.password)
      .then((user) => {
        const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });

        res.cookie('userToken', token, {
          maxAge: 604800000,
          httpOnly: true,
          sameSite: true,
        }).send({
          userData: user,
        });
      });
    return;
  } catch (err) {
    res.status(401)
      .send({ message: `Ошибка логина: ${err.message}` });
  }
  next();
}

async function getCurrentUser(req, res, next) {
  try {
    await User.findById(req.user._id)
      .orFail(new Error('NotFound'))
      .then((user) => res.send({ user }));
  } catch (err) {
    handleErr(err, res);
  }
  next();
}

async function updateUserProfile(req, res, next) {
  console.log(req.body);
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        name: req.body.name,
        about: req.body.about,
      },
      {
        runValidators: true,
        new: true,
      },
    )
      .orFail(new Error('NotFound'))
      .then((updatedUser) => res.send({ updatedUser }));
  } catch (err) {
    handleErr(err, res);
  }
  next();
}

async function updateUserAvatar(req, res, next) {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        avatar: req.body.avatar,
      },
      {
        runValidators: true,
        new: true,
      },
    )
      .orFail(new Error('NotFound'))
      .then((updatedUser) => res.send({ updatedUser }));
  } catch (err) {
    handleErr(err, res);
  }
  next();
}

module.exports = {
  getUsers,
  getCurrentUser,
  createUser,
  login,
  updateUserProfile,
  updateUserAvatar,
};
