class AlreadyExistsError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ObjectAlreadyExist';
    this.statusCode = 409;
  }
}

module.exports = AlreadyExistsError;
