const BadRequestError = require('./BadRequest');
const NotFoundError = require('./NotFound');
const UnAuthenticationError = require('./UnAuthentication');
const CustomError = require('./CustomError');
const UnauthorizedError = require('./unauthorized')

module.exports = {
    BadRequestError,
    NotFoundError,
    UnAuthenticationError,
    CustomError,
    UnauthorizedError
}