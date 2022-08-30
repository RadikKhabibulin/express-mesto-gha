const router = require('express').Router();
const {
  getUser, getUsers, createUser, updateUser,
} = require('../controllers/users');

const usersRouter = router;

usersRouter.get('/', getUsers);
usersRouter.post('/', createUser);
usersRouter.patch('/me', updateUser);
usersRouter.patch('/me/avatar', updateUser);
usersRouter.get('/:userId', getUser);

module.exports = usersRouter;
