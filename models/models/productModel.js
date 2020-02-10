'use strict';

const Model = require('./mongoModel');
const schema = require('../schema/productSchema');
/**
 * @class
 */
class Product extends Model {
  constructor() {
    super(schema);
  }
}

module.exports = Product;