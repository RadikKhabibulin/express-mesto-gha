const NotFoundCode = 404;

module.exports = (req, res) => {
  res.status(NotFoundCode).send({ message: 'Page not found' });
};
