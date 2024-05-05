const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    const isBanned = await authenticationServices.isBanned(email);

    if (isBanned) {
      const isRemoveBan = await authenticationServices.isRemoveBan(email);

      if (isRemoveBan) {
        await authenticationServices.resetLoginGagal(email);
      } else {
        throw errorResponder(
          errorTypes.TOO_MANY_FAILED_LOGIN_ATTEMPTS,
          'Too many failed login attempts. Please try again later.'
        );
      }
    }

    const limitExceeded = await authenticationServices.percobaanLogin(email);

    if (limitExceeded) {
      await authenticationServices.bannedLoginAttempt(email);

      throw errorResponder(
        errorTypes.TOO_MANY_FAILED_LOGIN_ATTEMPTS,
        'Too many failed login attempts. Please try again later.'
      );
    }

    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (!loginSuccess) {
      await authenticationServices.peningkatanJumlahPercobaanGagal(email);

      throw errorResponder(
        errorTypes.TOO_MANY_FAILED_LOGIN_ATTEMPTS,
        'Too many failed login attempts. Please try again later.'
      );
    }

    await authenticationServices.resetLoginGagal(email);

    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
