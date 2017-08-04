'use strict'

const clientModel = require('lib/model/clients');

exports = module.exports = {};

/**
* Saves a client.
* @param   {String}  client.clientID      - The unique client id (required)
* @param   {String}  client.clientSecret  - The unique client secret (required)
* @param   {String}  client.redirectURI   - The redirect URI of where to send access tokens once exchanged  (required)
* @param   {String}  client.name          - A human readable name (optional)
* @param   {String}  client.description   - A human readable description (optional)
* @param   {String}  client.grantTypes    - The grant type for acquiring the access token (optional)
* @param   {String}  client.userID        - The creator of the client (optional)
* @param   {String}  client.scope         - The scope (optional)
* @param   {String}  client.trustedClient - If this is set to true then the client is regarded as a trusted client and not a 3rd party application. Default is false (optional)
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
    trusted_client: client.trustedClient || false
  }).save();
};

/**
* Find a client by id.
* @param   {String}  clientId - The client unique id (required)
* @returns {Promise} resolved with the client
*/
exports.find = (clientId) => {
  return clientModel.where({
    id: clientId,
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
* Find a client by the client id and secret.
* @param   {String}  clientID - The unique client id (required)
* @param   {String}  clientSecret - The unique client secret (required)
* @returns {Promise} resolved with the client
*/
exports.findByClientSecret = (clientID, clientSecret) => {
  return clientModel.where({
    client_id: clientID,
    client_secret: clientSecret,
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
* @param   {String}  clientId - The client unique id (required)
* @returns {Promise} resolved with the client
*/
exports.delete = (clientId) => {
  return clientModel.forge().where({
    id: clientId,
  }).destroy({
    require: true,
  });
};

/**
* Delete a client by the client id.
* @param   {String}  clientID - The unique client id (required)
* @returns {Promise} resolved with the client
*/
exports.deleteByClientID = (clientID) => {
  return clientModel.forge().where({
    client_id: clientID,
  }).destroy({
    require: true,
  });
};
