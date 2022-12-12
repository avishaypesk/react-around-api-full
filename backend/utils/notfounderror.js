const errorCodes = require('./errorcodes');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = errorCodes.NOT_FOUND;
  }
}

module.exports = NotFoundError;
