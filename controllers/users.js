const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { handleErr, checkReqPath } = require('../utils/utils');

const { BadRequestError } = require('../errors/400-BadRequestError');
const { NotFoundError } = require('../errors/404-NotFoundError');
const { UnauthorizedError } = require('../errors/401-UnauthorizedError');
const { InternalServerError } = require('../errors/500-InternalServerError');
const { ConflictError } = require('../errors/409-ConflictError');

function getUsers(req, res, next) {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      throw new InternalServerError('Ошибка на сервере при получении данных пользователей');
    })
    .catch(next);
}

function createUser(req, res, next) {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при создании пользователя');
      } else if (err.code === 11000) {
        throw new ConflictError('Пользователь с такими данными уже зарегистрирован');
      } else if (err.name === 'NotFound') {
        throw new NotFoundError('Данные не найдены');
      } else if (err.statusCode === 500) {
        throw new InternalServerError('Ошибка на сервере при получении данных пользователей');
      }
    })
    .catch(next);
}

function login(req, res, next) {
  User.findUserByCredentials(req.body.email, req.body.password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });

      res.cookie('userToken', token, {
        maxAge: 604800000,
        httpOnly: true,
        sameSite: true,
      }).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch((err) => {
      throw new UnauthorizedError('Необходима авторизация');
    })
    .catch(next);
}

async function getCurrentUser(req, res, next) {
  const requestPathIsCorrect = Boolean(req.path == '/me');
  console.log(`This is request path: ${req.path} and it is: ${requestPathIsCorrect}`);

  if (!requestPathIsCorrect) {
    throw new BadRequestError('Переданы некорректные данные');
  } else if (requestPathIsCorrect) {
    await User.findById(req.user._id)
      .orFail(new Error('NotFound'))
      .then((user) => res.send({ user }))
      .catch((err) => handleErr(err))
      .catch(next);
  }
}

function updateUserProfile(req, res, next) {
  User.findByIdAndUpdate(
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
    .then((updatedUser) => res.send({ updatedUser }))
    .catch((err) => handleErr(err))
    .catch(next);
}

function updateUserAvatar(req, res, next) {
  User.findByIdAndUpdate(
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
    .then((updatedUser) => res.send({ updatedUser }))
    .then()
    .catch((err) => handleErr(err))
    .catch(next);
}

module.exports = {
  getUsers,
  getCurrentUser,
  createUser,
  login,
  updateUserProfile,
  updateUserAvatar,
};

/*
function getCurrentUser(req, res, next) {
  User.findById(req.user._id)
    .orFail(new Error('NotFound'))
    .then((user) => res.send({ user }))
    .orFail(new Error('BadRequest'))
    .catch((err) => {
      if (err.message === 'BadRequest') {
        throw new BadRequestError('Переданы некорректные данные');
      } else if (err.message === 'NotFound') {
        throw new NotFoundError('Данные не найденны');
      } else {
        throw new InternalServerError('Произошла ошибка на сервере');
      }
    })
    .catch(next);
}
*/