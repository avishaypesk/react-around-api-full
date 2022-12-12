const errorCodes = require('./errorcodes');

class InternalError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InternalError';
    this.statusCode = errorCodes.INTERNAL_SERVER;
  }
}

module.exports = InternalError;
