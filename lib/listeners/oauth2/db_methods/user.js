'use strict'

const userModel = require('lib/model/users');

exports = module.exports = {};

/**
* Find a user by id.
* @param   {String}  userId - The user unique id (required)
* @returns {Promise} resolved with the user
*/
exports.find = (userId) => {
  return userModel.where({
    id: userId,
  }).fetch();
};

/**
* Find a user by the username.
* @param   {String}  username - The unique username (required)
* @returns {Promise} resolved with the user
*/
exports.findByUsername = (username) => {
  return userModel.where({
    username: username,
  }).fetch();
};

/**
* Find a user by the username/password.
* @param   {String}  username - The unique username (required)
* @param   {String}  password - The password (required)
* @returns {Promise} resolved with the user
*/
exports.findByPassword = (username, password) => {
  return userModel.where({
    username: username,
    password: password
  }).fetch();
};
