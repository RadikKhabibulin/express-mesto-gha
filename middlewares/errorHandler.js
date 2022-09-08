module.exports.errorHandler = (err, req, res, _next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'Server error'
      : message,
  });
};
