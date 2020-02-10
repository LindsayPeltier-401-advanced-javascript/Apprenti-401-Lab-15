'use strict';

const User = require('../../models/user');

module.exports = (request, respond, next) => {
  try {
    let [authType, authString] = request.headers.authorization.split(/\s+/);

    switch (authType.toLowerCase()) {
      case 'basic':
        return _authBasic(authString);
      default:
        return _authError();
    }
  } catch (error) {
    next(error);
  }

  function _authBasic(string) {
    let base64Buffer = Buffer.from(string, 'base64');
    let bufferString = base64Buffer.toString();
    let [username, password] = bufferString.split(':');
    let auth = { username, password };

    return User.authenticateBasic(auth)
      .then(user => _authenticate(user))
      .catch(next);
  }

  function _authenticate(user) {
    if (user) {
      request.user = user;
      request.token = user.generateToken();
      next();
    } else {
      _authError();
    }
  }

  function _authError() {
    next('Invalid User ID/Password');
  }
};