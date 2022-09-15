const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');
const AlreadyExistsError = require('../errors/alreadyExistsError');
const UnauthorizedError = require('../errors/unauthorizedError');
const BadRequestError = require('../errors/badRequestError');

const { NODE_ENV, JWT_SECRET } = process.env;
const jwtCookieName = 'jwt';

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'debug-secret-key',
        { expiresIn: '7d' },
      );

      const tokenMaxAge = 1000 * 60 * 60 * 24;
      res
        .cookie(jwtCookieName, token, { maxAge: tokenMaxAge })
        .send({ message: 'Successful authentication' });
    })
    .catch(next);
};

module.exports.logout = (req, res, _next) => {
  res.clearCookie(jwtCookieName).send({ message: 'Successful logout' });
};

module.exports.getUsers = (req, res, next) => {
  User.find()
    .then((users) => {
      res.send({ data: users });
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Invalid token');
      }

      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new UnauthorizedError('Invalid token'));
        return;
      }

      next(err);
    });
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`User with _id=${req.user._id} not found`);
      }

      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(err.message));
        return;
      }

      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about, avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`User with _id=${req.user._id} not found`);
      }

      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError(err.message));
        return;
      }

      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      res.send(userObj);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new AlreadyExistsError(`User with email=${email} already exist`));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
        return;
      }

      next(err);
    });
};
