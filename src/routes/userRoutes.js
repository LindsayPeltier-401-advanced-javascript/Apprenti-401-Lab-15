'use strict';

const express = require('express');
const authRouter = express.Router();

const User = require('../../models/user');
const Role = require('../../models/models/accessModel');
const auth = require('../middleware/authMiddleware');
const oauth = require('../middleware/github_OAuth.js');
const bearerAuth = require('../middleware/bearerMiddleware');

const capabilities = {
  admin: ['create', 'read', 'update', 'delete', 'superuser'],
  editor: ['create', 'read', 'update'],
  user: ['read'],
};

authRouter.get('/v1/users', (request, response, next) => {
  User.find({}).then(data => {
    const output = {
      count: data.length,
      results: data,
    };
    response.json(output);
  });
});

authRouter.post('/v1/signup', (request, response, next) => {
  let user = new User(request.body);
  user
    .save()
    .then(user => {
      request.token = user.generateToken(request.role);
      request.user = user;
      response.set('token', request.token);
      response.cookie('auth', request.token);
      response.send(request.token);
    })
    .catch(next);
});

authRouter.post('/v1/signin', auth, (request, response, next) => {
  response.cookie('auth', request.token);
  response.send(request.token);
});

authRouter.get('/v1/user', bearerAuth, (request, response) => {
  response.json(request.user);
});

authRouter.get('/v1/oauth', oauth, (request, response) => {
  response.send(request.token);
});

authRouter.post('/v1/roles', (request, response, next) => {
  let saved = [];
  Object.keys(capabilities).map(role => {
    let newRecord = new Role({ type: role, capabilities: capabilities[role] });
    saved.push(newRecord.save());
  });
  Promise.all(saved);
  response.send('Roles Created');
});

module.exports = authRouter;