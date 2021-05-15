const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');

const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const notFoundRoutes = require('./routes/notFound');

const { handleAuthorization } = require('./middlewares/auth');

const {
  createUser,
  login,
} = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb',
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

app.use('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).max(30),
    password: Joi.string().required().min(8),
  }),
}), login);

app.use('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required(),
    email: Joi.string().required().min(2).max(30),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.use('/users', handleAuthorization, usersRoutes);
app.use('/cards', handleAuthorization, cardsRoutes);
app.use('*', notFoundRoutes);

app.use(errors());

app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
});

app.listen(PORT, () => {
  console.log(`Server launched sucesfully! App listening on port: ${PORT}`);
});

/*
Ревьюэр:

Надо исправить

При передаче невалидного id должна быть ошибка 400, сейчас 404 https://pastenow.ru/7b85cb551f65fd29a92ad80d6b6d3d81 

Не работает валидация ссылки https://pastenow.ru/352506724be14f3836b4c103950638d7
Так же не работает валидация ссылки https://pastenow.ru/b28807babf234bf927eda55764cd6509
При удалении чужой карточки должна быть ошибка 403, сейчас 400    Важно работа будет принята на ревью, только после исправления всех ремарок из пункта Надо исправить иначе в ревью будет отклонено, а вы потеряете одну итерацию. Поэтому хорошо убедитесь, что всё точно исправлено, проверьте себя перед отправкой на ревью

*/