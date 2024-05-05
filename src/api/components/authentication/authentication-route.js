const express = require('express');
const authenticationControllers = require('./authentication-controller');
const authenticationValidators = require('./authentication-validator');
const celebrate = require('../../../core/celebrate-wrappers');

const route = express.Router();

module.exports = (app) => {
  // Menambahkan rute login ke dalam route authentication
  route.post(
    '/login',
    celebrate(authenticationValidators.login),
    authenticationControllers.login
  );

  // Menyematkan route authentication di bawah /authentication di aplikasi Express
  app.use('/authentication', route);
};
