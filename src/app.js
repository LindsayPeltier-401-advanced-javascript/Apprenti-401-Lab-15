'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const routes = require('./routes/routes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(userRoutes);
app.use(routes);

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../docs/config/swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


module.exports = {
  server: app,
  start: (port) => app.listen(port, () => console.log(`Server up on port ${port}`)),
};