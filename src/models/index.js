const mongoose = require('mongoose');
const config = require('../core/config');
const logger = require('../core/logger')('app');

const usersSchema = require('./users-schema');
const productsSchema = require('./product-schema');

mongoose
  .connect(`${config.database.connection}/${config.database.name}`, {
    useNewUrlParser: true,
  })
  .then(() => {
    logger.info('Successfully connected to MongoDB');
  })
  .catch((err) => {
    logger.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit process on connection error
  });

const User = mongoose.model('User', usersSchema);
const Product = mongoose.model('Product', productsSchema);

module.exports = {
  mongoose,
  User,
  Product,
};
