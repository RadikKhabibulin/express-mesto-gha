require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const pageNotFoundRouter = require('./routes/pageNotFound');
const linkRegex = require('./validators/linkValidator');
const auth = require('./middlewares/auth');
const corsHandler = require('./middlewares/corsHandler');
const { errorHandler } = require('./middlewares/errorHandler');
const { createUser, login } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3001 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

const app = express();

app.use(cookieParser());
app.use(corsHandler);
app.use(bodyParser.json());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(new RegExp(linkRegex)),
  }),
}), createUser);

app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);
app.use('/', pageNotFoundRouter);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
