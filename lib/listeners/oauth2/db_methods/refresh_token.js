'use strict'

const refreshTokenModel = require('lib/model/refresh_token');

exports = module.exports = {};

/**
* Returns a refresh token if it finds one.
* @param   {String}  token - The token to decode to get the id of the access token to find.
* @returns {Promise} resolved with the token
*/
exports.find = (token) => {
  return refreshTokenModel.where({
    access_token: jwt.decode(token).jti,
  }).fetch();
};

/**
 * Saves a refresh token, expiration date, user id, client id, and scope.
 * @param   {String}  refreshToken.token          - The refresh token (required)
 * @param   {String}  refreshToken.clientID       - The client ID (required)
 * @param   {String}  refreshToken.userID         - The user ID (required)
 * @param   {Date}    refreshToken.expirationDate - The expiration of the access token (required)
 * @param   {String}  refreshToken.scope          - The scope (optional)
 * @returns {Promise} resolved with the saved token
 */
exports.save = (refreshToken) => {
    return refreshTokenModel.forge({
      refresh_token: jwt.decode(refreshToken.token).jti,
      client_id: refreshToken.clientID,
      user_id: refreshToken.userID,
      expiration_date: refreshToken.expirationDate,
      scope: refreshToken.scope,
    }).save();
};

/**
 * Deletes/Revokes an refresh token.
 * @param   {String}  refreshToken.token - The token to decode to get the id of the access token to delete.
 * @returns {Promise} resolved with the deleted token
 */
exports.delete = (refreshToken) => {
  return refreshTokenModel.forge().where({
    access_token: jwt.decode(refreshToken.token).jti,
  }).destroy({
    require: true,
  });
};

/**
 * Removes expired refresh tokens.
 * @returns {Promise} resolved with an associative of tokens that were expired
 */
exports.removeExpired = () => {
  return refreshTokenModel.query( qb => {
    qb.where('expiration_date', '<', new Date()).fetch();
  }).destroy({
    require: true,
  });
};
