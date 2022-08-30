const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');
const HttpError = require('../errors/httpError');

const BadRequestCode = 400;
const ServerErrorCode = 500;

module.exports.getUsers = (req, res) => {
  User.find()
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => res.status(ServerErrorCode).send({ message: err.message }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`User with _id=${req.user._id} not found`);
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BadRequestCode).send({ message: err.message });
        return;
      }
      if (err instanceof HttpError) {
        res.status(err.statusCode).send({ message: err.message });
        return;
      }
      res.status(ServerErrorCode).send({ message: err.message });
    });
};

module.exports.updateUser = (req, res) => {
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
        res.status(BadRequestCode).send({ message: err.message });
        return;
      }
      if (err instanceof HttpError) {
        res.status(err.statusCode).send({ message: err.message });
        return;
      }
      res.status(ServerErrorCode).send({ message: err.message });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BadRequestCode).send({ message: err.message });
        return;
      }
      res.status(ServerErrorCode).send({ message: err.message });
    });
};
