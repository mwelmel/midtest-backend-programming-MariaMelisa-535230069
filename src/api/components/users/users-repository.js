const { User } = require('../../../models');

/**
 * Get a list of users with pagination and metadata
 * @param {Object} options - Options for pagination and filtering
 * @param {int} options.page_number - Page number of users
 * @param {int} options.page_size - Size of page
 * @param {string} options.search - Search query for filtering users
 * @returns {Promise<Object>} - Promise resolving to an object containing users data and metadata
 */
async function getUsers({
  query,
  page_number = 1,
  page_size = 10,
  sortOptions,
}) {
  try {
    // Get paginated users
    const users = await User.find(query)
      .sort(sortOptions)
      .skip((page_number - 1) * page_size)
      .limit(page_size);

    // Return users data
    return users;
  } catch (error) {
    throw error;
  }
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

/**
 * Update user password
 * @param {string} id - User ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function changePassword(id, password) {
  return User.updateOne({ _id: id }, { $set: { password } });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  changePassword,
};
