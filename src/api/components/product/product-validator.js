const joi = require('joi');

module.exports = {
  createProduct: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      price: joi.number().positive().precision(2).required().label('Price'),
    },
  },

  updateProduct: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      price: joi.number().positive().precision(2).required().label('Price'),
    },
  },
};
