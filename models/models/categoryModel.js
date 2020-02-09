'use strict';

const Model = require('./mongoModel');
const schema = require('..schema/categorySchema');

/**
 * @class
 */
class Categories extends Model {
  constructor() {
    super(schema);
  }
}

module.exports = Categories;