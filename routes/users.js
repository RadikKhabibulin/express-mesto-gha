const router = require('express').Router();
const { getUser, getUsers, createUser } = require('../controllers/users');

const usersRouter = router;

usersRouter.get('/', getUsers);
usersRouter.get('/:userId', getUser);
usersRouter.post('/', createUser);

module.exports = usersRouter;
