const NotFoundError = require('../errors/notFoundError');

module.exports = (req, res, next) => {
  next(new NotFoundError('Page not found'));
};
