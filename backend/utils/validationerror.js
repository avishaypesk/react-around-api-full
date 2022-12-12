const errorCodes = require('./errorcodes');

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = errorCodes.BAD_REQUEST;
  }
}

module.exports = ValidationError;
