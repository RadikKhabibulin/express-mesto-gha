const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser, getUserById, getUsers, updateUser,
} = require('../controllers/users');

const usersRouter = router;

usersRouter.get('/', getUsers);
usersRouter.get('/me', getUser);

usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

usersRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string(),
  }),
}), updateUser);

usersRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    cardId: Joi
      .string()
      .required()
      .hex()
      .min(24)
      .max(24),
  }),
}), getUserById);

module.exports = usersRouter;
