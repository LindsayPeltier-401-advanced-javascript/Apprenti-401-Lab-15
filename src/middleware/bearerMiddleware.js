'use strict';

const User = require('../../models/user');

module.exports = (request, response, next) => {
  if (!request.headers.authorization) {
    next('Invalid Login');
    return;
  }
  console.log('Welcome');
  let token = request.headers.authorization.split(' ').pop();

  User.authenticateToken(token)
    .then(validUser => {
      request.user = validUser;
      next();
    })
    .catch(error => {
      console.log(error);
      next('Invalid Login');
    });
};