const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    next(new UnauthorizedError('Authorization is required'));
    return;
  }

  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'debug-secret-key',
    );
  } catch (err) {
    next(new UnauthorizedError('Authorization is required'));
    return;
  }

  req.user = payload;
  next();
};
