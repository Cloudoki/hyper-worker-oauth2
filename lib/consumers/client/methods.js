'use strict'

const clientModel = require('lib/model/clients');

exports = module.exports = {};

/**
* Saves a client.
* @param   {String}  client.clientID     - The unique client id (required)
* @param   {String}  client.clientSecret - The unique client secret (required)
* @param   {String}  client.redirectURI  - The redirect URI of where to send access tokens once exchanged  (required)
* @param   {String}  client.name         - A human readable name (optional)
* @param   {String}  client.description  - A human readable description (optional)
* @param   {String}  client.grantTypes   - The grant type for acquiring the access token (optional)
* @param   {String}  client.userID       - The creator of the client (optional)
* @param   {String}  client.scope        - The scope (optional)
* @returns {Promise} resolved with the client
*/
exports.save = (client) => {
  return clientModel.forge({
    client_id: client.clientID,
    client_secret: client.clientSecret,
    redirect_uri: client.redirectURI,
    name: client.name,
    description: client.description,
    grant_types: client.grantTypes,
    user_id: client.userID,
    scope: client.scope,
  }).save();
};

/**
* Find a client by id.
* @param   {String}  client.id - The client unique id (required)
* @returns {Promise} resolved with the client
*/
exports.find = (client) => {
  return clientModel.where({
    id: client.id,
  }).fetch();
};

/**
* Find a client by the client id.
* @param   {String}  clientID - The unique client id (required)
* @returns {Promise} resolved with the client
*/
exports.findByClientID = (clientID) => {
  return clientModel.where({
    client_id: clientID,
  }).fetch();
};

/**
* Updates the client data.
* @param   {String}  client.id           - The client id (required)
* @param   {String}  client.clientSecret - The unique client secret (required)
* @param   {String}  client.redirectURI  - The redirect URI of where to send access tokens once exchanged  (required)
* @param   {String}  client.name         - A human readable name (optional)
* @param   {String}  client.description  - A human readable description (optional)
* @returns {Promise} resolved with the client
*/
exports.update = (client) => {
  return clientModel.forge()
  .where({
    id: client.id
  }).save({
    client_secret: client.clientSecret,
    redirect_uri: client.redirectURI,
    name: client.name,
    description: client.description,
  });
};

/**
* Delete a client by the id.
* @param   {String}  client.id - The client unique id (required)
* @returns {Promise} resolved with the client
*/
exports.delete = (client) => {
  return clientModel.forge().where({
    id: client.id,
  }).destroy({
    require: true,
  });
};

/**
* Delete a client by the client id.
* @param   {String}  client.id - The unique client id (required)
* @returns {Promise} resolved with the client
*/
exports.deleteByClientID = (client) => {
  return clientModel.forge().where({
    client_id: client.clientID,
  }).destroy({
    require: true,
  });
};
