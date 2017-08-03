'use strict'

const clientModel = require('lib/model/clients');

exports = module.exports = {};

/**
 * Find a client by id.
 * @param   {String}  client.id - The client unique id (required)
 * @returns {Promise} resolved with the client
 */
exports.get = (client) => {
  return clientModel.where({
    id: client.id
  }).fetch();
};

/**
 * List clients.
 * @param   {String}  meta.order_by
 * @param   {String}  meta.dir
 * @param   {String}  meta.p_size
 * @param   {String}  meta.page
 * @param   {String}  meta.f_field
 * @param   {String}  meta.field
 * @returns {Promise} resolved with the clients array
 */
exports.list = (meta) => {

  if (!meta.order_by) meta.order_by = 'name';
  if (!meta.dir) meta.dir = 'asc';
  if (!meta.p_size) meta.p_size = 500;
  if (!meta.page) meta.page = 1;

  let query = clientModel.forge().orderBy(meta.order_by, meta.dir);

  if (meta.f_field && meta.filter) {
    query.where(meta.f_field, 'LIKE', `%${meta.filter}%`);
  }

  return query.fetchPage({
    pageSize: meta.p_size,
    page: meta.page
  });

};

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
exports.add = (client) => {

  return clientModel.where({
    client_id: client.clientID
  }).count().then((c) => {

    return new Promise((resolve, reject) => {

      if (c === 1) {
        reject(new hyperError.Conflict('This clientID is already being used by another client'));
        return
      }

      resolve();

    });

  }).then(() => {

    return new Promise((resolve, reject) => {

      if (client.user && client.user.id) {
        return userModel.where({
          id: client.user.id
        }).count().then((c) => {

          if (c === 0) {
            reject(new hyperError.BadReference('User does not exists'));
            return
          }

          resolve();
          return
        });
      }

      resolve();

    });

  }).then(() => {

    let newClient = {
      client_id: client.clientID,
      client_secret: client.clientSecret,
      redirect_uri: client.redirectURI,
      name: client.name,
      description: client.description,
      grant_types: client.grantTypes,
      user_id: client.userID,
      scope: client.scope,
    };

    let load = [];

    if (client.user && client.user.id) {
      newClient.user_id = clint.user.id;
      load.push('user');
    }

    return clientModel.forge(newClient).save().then((c) => {
      return c.load(load);
    }).catch((err) => {
      return new Promise((resolve, reject) => {
        reject(err);
      });
    });

  }).catch((err) => {
    return new Promise((resolve, reject) => {
      reject(err);
    });
  });

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

  return clientModel.where({
    id: client.id
  }).count().then((c) => {

    return new Promise((resolve, reject) => {

      if (c === 0) {
        reject(new hyperError.NotFound());
        return
      }

      resolve();

    });

  }).then(() => {

    let newClient = {
      client_secret: client.clientSecret,
      redirect_uri: client.redirectURI,
      name: client.name,
      description: client.description
    };

    return clientModel.forge({
      id: client.id
    }).save(newClient, {
      method: 'update'
    }).then((u) => {
      return u.load(['user']);
    }).catch((err) => {
      return new Promise((resolve, reject) => {
        reject(err);
      });
    });

  }).catch((err) => {
    return new Promise((resolve, reject) => {
      reject(err);
    });
  });

};

/**
 * Delete a client by the id.
 * @param   {String}  client.id - The client unique id (required)
 * @returns {Promise} resolved with the client
 */
exports.delete = (client) => {

  return clientModel.forge({
        id: client.id
    }).fetch().then((c) => {

        if (!c) {
            return new Promise((resolve, reject) => {
                reject(new hyperError.NotFound());
            });
        }

        return c.destroy({
            require: true
        });

    }).catch((err) => {
        return new Promise((resolve, reject) => {
            reject(err);
        });
    });

};