const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

/**
 * Get list of users
 * @returns {Array}
 */

async function getUsers({
  page_number = 1,
  page_size = 10,
  sort_by = 'name',
  sort_order = 'asc',
  search = '',
} = {}) {
  try {
    // Validasi parameter masukan
    if (isNaN(page_number) || isNaN(page_size)) {
      throw new Error('Invalid page_number or page_size');
    }

    // Membuat objek query kosong
    let query = {};

    // Menambahkan query pencarian jika ada
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      };
    }

    // Menentukan opsi pengurutan
    const sortOptions = {};
    sortOptions[sort_by] = sort_order === 'asc' ? 1 : -1;

    // Mendapatkan data pengguna dengan pagination dan sorting
    const userData = await usersRepository.getUsers({
      query,
      page_number,
      page_size,
      sortOptions,
    });

    // Mendapatkan total pengguna (untuk pagination)
    const totalUsers = userData.length;

    // Menghitung apakah halaman sebelumnya atau halaman berikutnya tersedia
    const has_previous_page = page_number > 1;
    const has_next_page = page_number * page_size < totalUsers;

    // Mengembalikan hasil dalam format yang diinginkan
    return {
      page_number: parseInt(page_number),
      page_size: parseInt(page_size),
      count: totalUsers,
      total_pages: Math.ceil(totalUsers / page_size),
      has_previous_page,
      has_next_page,
      data: userData,
    };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getUsers,
};

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);

  // Check if user not found
  if (!user) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await usersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
};
