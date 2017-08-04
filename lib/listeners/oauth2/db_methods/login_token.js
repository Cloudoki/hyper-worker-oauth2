'use strict'

const loginModel = require('lib/model/login')

exports = module.exports = {}

/**
* Saves a login token.
* @param   {String}  login.userID         - The unique user id (required)
* @param   {String}  login.accountID      - The unique account id (required)
* @param   {String}  login.token          - The access token generated for this user/account combination  (required)
* @param   {Date}    login.expirationDate - The expiration date of the token
* @returns {Promise} resolved with the login data
*/
exports.save = (login) => {
  return loginModel.forge({
    user_id: login.userID,
    account_id: login.accountID,
    token: login.token,
    expiration_date: login.expirationDate
  }).save()
}

/**
* Find a login data by token.
* @param   {String}  token - The token (required)
* @returns {Promise} resolved with the login data
*/
exports.find = (token) => {
  return loginModel.where({
    token: token
  }).fetch()
}

/**
* Updates the login data.
* @param   {String}  login.userID         - The unique user id (required)
* @param   {String}  login.accountID      - The unique account id (required)
* @param   {String}  login.token          - The access token generated for this user/account combination  (required)
* @param   {Date}    login.expirationDate - The expiration date of the token
* @returns {Promise} resolved with the login data
*/
exports.update = (login) => {
  return loginModel.forge()
  .where({
    user_id: login.userID,
    account_id: login.accountID
  }).save({
    token: login.token,
    expiration_date: login.expirationDate
  })
}

/**
* Delete the login data.
* @param   {String}  token - The token (required)
* @returns {Promise} resolved with the login data
*/
exports.delete = (token) => {
  return loginModel.forge().where({
    token: token
  }).destroy({
    require: true
  })
}
