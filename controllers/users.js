const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { handleErr } = require('../utils/utils');

const { BadRequestError } = require('../errors/400-BadRequestError');
const { NotFoundError } = require('../errors/404-NotFoundError');
const { UnauthorizedError } = require('../errors/401-UnauthorizedError');
const { InternalServerError } = require('../errors/500-InternalServerError');

function getUsers(req, res, next) {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      throw new InternalServerError(`Ошибка на сервере при получении данных пользователей: ${err}`);
    })
    .catch(next);
}

function createUser(req, res, next) {
  bcrypt.hash(req.body.password, 10)
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
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(`Переданы некорректные данные при создании пользователя: ${err}`);
      } else if (err.name === 'NotFound') {
        throw new NotFoundError(`Данные не найдены: ${err}`);
      } else {
        throw new InternalServerError(`Ошибка на сервере при получении данных пользователей: ${err}`);
      }
    }).catch(next);
}

async function login(req, res, next) {
  User.findUserByCredentials(req.body.email, req.body.password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });

      res.cookie('userToken', token, {
        maxAge: 604800000,
        httpOnly: true,
        sameSite: true,
      }).send({
        userData: user,
      });
    })
    .catch((err) => {
      throw new UnauthorizedError(`Необходима авторизация: ${err}`);
    })
    .catch(next);
}

function getCurrentUser(req, res, next) {
  User.findById(req.user._id)
    .orFail(new Error('NotFound'))
    .then((user) => res.send({ user }))
    .catch((err) => handleErr(err))
    .catch(next);
}

async function updateUserProfile(req, res, next) {
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

async function updateUserAvatar(req, res, next) {
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
