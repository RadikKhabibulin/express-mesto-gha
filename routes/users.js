const router = require('express').Router();
const {
  getUser, getUsers, createUser, updateUser,
} = require('../controllers/users');

const usersRouter = router;

usersRouter.get('/', getUsers);
usersRouter.patch('/me', updateUser);
usersRouter.patch('/me/avatar', updateUser);
usersRouter.get('/:userId', getUser);
usersRouter.post('/', createUser);

module.exports = usersRouter;
