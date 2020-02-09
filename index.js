'use strict';

require('dotenv').config();
const mongoose = require('mongoos');

const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

mongoose.connect(process.env.MONGODB_URI, mongooseOptions).catch(err => console.log(err));

require('./src/app.js').start(process.env.PORT);