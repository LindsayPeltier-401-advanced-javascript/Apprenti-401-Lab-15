'use strict';

module.exports = (err, request, response, next) => {
  let error = { error: err };
  response.statusCode = 500;
  response.statusMessage = 'Server Error';
  response.setHeader('Content-Type', 'application/json');
  response.write(JSON.stringify(error));
  response.end();
};