const express = require('express');
const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const productsControllers = require('./product-controller');
const productsValidator = require('./product-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/product', route);

  // Middleware for authentication if needed
  // route.use(authenticationMiddleware);

  // GET all products
  route.get('/', productsControllers.getProducts);

  // Create a new product
  route.post(
    '/',
    celebrate(productsValidator.createProduct),
    productsControllers.createProduct
  );

  // GET a specific product by ID
  route.get('/:id', productsControllers.getProduct);

  // Update a specific product by ID
  route.put(
    '/:id',
    celebrate(productsValidator.updateProduct),
    productsControllers.updateProduct
  );

  // Delete a specific product by ID
  route.delete('/:id', productsControllers.deleteProduct);
};
