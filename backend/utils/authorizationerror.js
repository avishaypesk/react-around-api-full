const errorCodes = require('./errorcodes');

class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthorizationError';
    this.statusCode = errorCodes.UNAUTHORIZED;
  }
}

module.exports = AuthorizationError;
