'use strict';

const express = require('express');
const router = express.Router();

const Categories = require('../../models/models/categoryModel');
const categories = new Categories();
const Products = require('../../models/models/productModel');
const products = new Products();

// Esoteric Resources
const errorHandler = require('../middleware/500.js');
const notFound = require('../middleware/404.js');

// Auth
const auth = require('../middleware/authMiddleware');
const acl = require('../middleware/accessMiddleware');
const bearerAuth = require('../middleware/bearerMiddleware');
const User = require('../../models/user');


function getModel(request, response, next) {
  const model = request.params.model;
  switch (model) {
    case 'products':
      request.model = products;
      next();
      return;
    case 'categories':
      request.model = categories;
      next();
      return;
    default:
      request.model = 'Invalid Model';
      next();
      return;
  }
}

router.param('model', getModel);

router.get('/api/v1/:model', bearerAuth, handleGetAll);
router.post('/api/v1/:model', bearerAuth, acl('create'), handlePost);
router.get('/api/v1/:model/:id', bearerAuth, handleGetOne);
router.put('/api/v1/:model/:id', bearerAuth, acl('update'), handlePut);
router.delete('/api/v1/:model/:id', bearerAuth, acl('delete'), handleDelete);


router.use(notFound);
router.use(errorHandler);
/**
 * 
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function handleGetAll(request, response, next) {
  request.model
    .get()
    .then(data => {
      const output = {
        count: data.length,
        results: data,
      };
      response.status(200).json(output);
    })
    .catch(next);
}
/**
 * 
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function handleGetOne(request, response, next) {
  request.model
    .get(request.params.id)
    .then(result => response.status(200).json(result))
    .catch(next);
}
/**
 * 
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function handlePost(request, response, next) {
  request.model
    .post(request.body)
    .then(result => response.status(200).json(result))
    .catch(next);
}
/**
 * 
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function handlePut(request, response, next) {
  request.model
    .put(request.params.id, request.body)
    .then(result => response.status(200).json(result))
    .catch(next);
}
/**
 * 
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function handleDelete(request, response, next) {
  request.model
    .delete(request.params.id)
    .then(result => response.status(200).json(result))
    .catch(next);
}

module.exports = router;