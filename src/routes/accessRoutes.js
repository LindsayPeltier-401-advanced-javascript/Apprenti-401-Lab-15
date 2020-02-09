'use strict';

const express = require('express');
const router = express.Router();
const bearerAuth = require('../middleware/bearerMiddleware');
const acl = require('../middleware/accessMiddleware');
const Role = require('../../models/models/accessModel');

const capabilities = {
  admin: ['create', 'read', 'update', 'delete', 'superuser'],
  editor: ['create', 'read', 'update'],
  user: ['read'],
};

router.post('/roles', (request, response, next) => {
  let saved = [];
  Object.keys(capabilities).map(role => {
    let newRecord = new Role({ type: role, capabilities: capabilities[role] });
    saved.push(newRecord.save());
  });
  Promise.all(saved);
  response.send('Roles Created');
});

router.get('/public');

router.get('/private', bearerAuth, (request, response, next) => {
  response.send('OK');
});

router.get('/readonly', bearerAuth, acl('read'), (request, response, next) => {
  response.send('OK');
});

router.get('/create', bearerAuth, acl('create'), (request, response, next) => {
  response.send('OK');
});

router.post('/update', bearerAuth, acl('update'), (request, response, next) => {
  response.send('OK');
});

router.patch('/delete', bearerAuth, acl('delete'), (request, response, next) => {
  response.send('OK');
});

router.get('/everything', bearerAuth, acl('superuser'), (request, response, next) => {
  response.send('OK');
});

module.exports = router;