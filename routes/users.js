const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const linkRegex = require('../validators/linkValidator');
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
    avatar: Joi.string().required().pattern(new RegExp(linkRegex)),
  }),
}), updateUser);

usersRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi
      .string()
      .required()
      .hex()
      .min(24)
      .max(24),
  }),
}), getUserById);

module.exports = usersRouter;
