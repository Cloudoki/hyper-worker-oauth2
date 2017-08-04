'use strict'

const authorizationCodeModel = require('lib/model/authorization_codes');
const jwt = require('jsonwebtoken');
const config = require('../../../config');

exports = module.exports = {};

/**
 * Returns an authorization code if it finds one.
 * @param   {String}  token - The token to decode to get the id of the authorization token to find.
 * @returns {Promise} resolved with the authorization code
 */
exports.find = (token) => {
  return authorizationCodeModel.where({
    authorization_code: jwt.decode(token).jti,
  }).fetch();
};

/**
 * Saves a authorization code, client id, redirect uri, user id, and scope.
 * @param   {String}  authorizationCode.code        - The authorization code (required)
 * @param   {String}  authorizationCode.clientID    - The client ID (required)
 * @param   {String}  authorizationCode.redirectURI - The redirect URI of where to send access tokens once exchanged
 * @param   {String}  authorizationCode.userID      - The user ID (required)
 * @param   {String}  authorizationCode.scope       - The scope (optional)
 * @returns {Promise} resolved with the saved token
 */
exports.save = (authorizationCode) => {
    return authorizationCodeModel.forge({
      authorization_code: jwt.decode(authorizationCode.code).jti,
      client_id: authorizationCode.clientID,
      user_id: authorizationCode.userID,
      redirect_uri: authorizationCode.redirectURI,
      expiration_date: config.oauth2.code_expiresIn,
      scope: authorizationCode.scope,
    }).save();
};

/**
 * Deletes an authorization code
 * @param   {String}  token - The authorization code to delete
 * @returns {Promise} resolved with the deleted value
 */
exports.delete = (token) => {
  return authorizationCodeModel.forge().where({
    authorization_code: jwt.decode(token).jti,
  }).destroy({
    require: true,
  });
};

/**
 * Removes expired codes.
 * @returns {Promise} resolved with an associative of codes that were expired
 */
exports.removeExpired = () => {
  return authorizationCodeModel.query( qb => {
    qb.where('expiration_date', '<', new Date()).fetch();
  }).destroy({
    require: true,
  });
};
