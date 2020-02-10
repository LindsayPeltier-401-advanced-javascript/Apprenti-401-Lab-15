'use strict';

module.exports = (require, response, next) => {
  let error = { error: 'Resource Not Found' };
  response.statusCode = 404;
  response.statusMessage = 'Not Found';
  response.setHeader('Content-Type', 'application/json');
  response.write(JSON.stringify(error));
  response.end();
};