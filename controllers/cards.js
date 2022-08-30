const Card = require('../models/card');
const NotFoundError = require('../errors/notFoundError');
const HttpError = require('../errors/httpError');

const BadRequestCode = 400;
const ServerErrorCode = 500;

module.exports.getCards = (req, res) => {
  Card.find()
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => res.status(ServerErrorCode).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(BadRequestCode).send({ message: err.message });
        return;
      }
      res.status(ServerErrorCode).send({ message: err.message });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Card with _id=${req.params.cardId} not found`);
      }
      res.send({ data: card });
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

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Card with _id=${req.params.cardId} not found`);
      }
      res.send({ data: card });
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

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Card with _id=${req.params.cardId} not found`);
      }
      res.send({ data: card });
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
