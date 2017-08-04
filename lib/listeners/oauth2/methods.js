'use strict'

const hyperError = require('hyper-error')
const config = require('../../configOLD')
const dbMethods = require('./db_methods')
const utils = require('./utils')
const validate = require('./validate')
const grantTypes = [ 'authorization_code', 'client_credencials', 'implicit', 'password' ]
const expiresIn = config.oauth2.token_expiresIn

exports = module.exports = {}

/**
* Validate if grant is valid
* @param {String} grant - The grant that was requested
* @returns {Boolean} true if valid, false otherwise.
*/
const validateGrant = function (grant) {
  return grantTypes.includes(grant)
}

/**
* Grant implicit authorization
*/
exports.implicit = function (clientID, userID, grant) {
  if (!validateGrant(grant) || grant !== 'implicit') {
    return new Promise((resolve, reject) => {
      reject(new hyperError.InvalidGrant())
    })
  }
  dbMethods.clients.findByClientID(clientID)
  .then((localClient) => {
    return new Promise((resolve, reject) => {
      if (localClient) {
        const token = utils.createToken({ sub: userID, exp: expiresIn })
        const expiration = utils.calculateExpirationDate(expiresIn)
        const accessToken = {
          token,
          clientID,
          userID,
          expirationDate: expiration,
          scope: localClient.scope
        }
        dbMethods.accessTokens.save(accessToken)
        .then(() => resolve(token, expiresIn))
        .catch((err) => reject(err))
      } else {
        reject(new hyperError.NotFound('Client was not found.'))
      }
    })
  })
  .catch((err) => {
    return new Promise((resolve, reject) => {
      reject(err)
    })
  })
}

/**
 * Exchange the client id and password/secret for an access token.
 */
exports.client_credencials = function (client, scope, grant) {
  if (!validateGrant(grant) || grant !== 'client_credencials') {
    return new Promise((resolve, reject) => {
      reject(new hyperError.InvalidGrant())
    })
  }
  dbMethods.clients.findByClientID(client.clientID)
  .then((localClient) => {
    return new Promise((resolve, reject) => {
      if (localClient.redirectURI !== client.redirectURI) {
        reject(new hyperError.InvalidRedirectURI('Redirect URI does not match'))
        return
      }
      if (localClient.clientSecret !== client.clientSecret) {
        reject(new hyperError.InvalidSecret('Client secret does not match'))
        return
      }
      const token = utils.createToken({ sub: client.id, exp: expiresIn })
      const expiration = utils.calculateExpirationDate(expiresIn)
      const accessToken = {
        token,
        clientID: client.clientID,
        userID: null, // null since there is no user when using this grant type
        expirationDate: expiration,
        scope: client.scope
      }
      dbMethods.accessTokens.save(accessToken)
      .then(() => resolve(token, expiresIn))
      .catch(err => reject(err))
    })
  })
  .catch(err => {
    return new Promise((resolve, reject) => {
      reject(err)
    })
  })
}

/**
* Grant authorization code
*/
exports.authorization_code = function (clientID, userID, scope, grant) {
  if (!validateGrant(grant) || grant !== 'authorization_code') {
    return new Promise((resolve, reject) => {
      reject(new hyperError.InvalidGrant())
    })
  }
  dbMethods.clients.findByClientID(clientID)
  .then((localClient) => {
    return new Promise((resolve, reject) => {
      if (localClient) {
        const code = utils.createToken({ sub: userID, exp: config.oauth2.code_expiresIn })
        const authorizationCode = {
          code,
          clientID,
          redirectURI: localClient.redirectURI,
          userID,
          scope
        }
        dbMethods.authorizationCodes.save(authorizationCode)
        .then(() => resolve(code, localClient.redirectURI))
        .catch((err) => reject(err))
      } else {
        reject(new hyperError.NotFound('Invalid client id'))
      }
    })
  })
  .catch((err) => {
    return new Promise((resolve, reject) => {
      reject(err)
    })
  })
}

/**
 * Exchange authorization code for access tokens.
 */
exports.authorization_code_exchange = function (clientID, code, redirectURI, makeRefresh) {
  dbMethods.authorizationCodes.delete(code)
  .then(authCode => validate.authCode(code, authCode, clientID, redirectURI))
  .then(authCode => {
    authCode.refresh = makeRefresh
    return validate.generateTokens(authCode)
  })
  .then((tokens) => {
    return new Promise((resolve, reject) => {
      if (tokens.length === 1) {
        resolve(tokens[0], null, expiresIn)
        return
      }
      if (tokens.length === 2) {
        resolve(tokens[0], tokens[1], expiresIn)
        return
      }
      reject(new hyperError.ExchangeFailed('Error exchanging auth code for tokens'))
    })
  })
  .catch((err) => {
    return new Promise((resolve, reject) => {
      reject(err)
    })
  })
}

/**
 * Exchange the refresh token for an access token.
 */
exports.refreshToken = function (client, refreshToken, scope, done) {
  dbMethods.refreshTokens.find(refreshToken)
  .then(foundRefreshToken => validate.refreshToken(foundRefreshToken, refreshToken, client))
  .then(foundRefreshToken => validate.generateToken(foundRefreshToken))
  .then(token => {
    return new Promise((resolve, reject) => {
      resolve(token, expiresIn)
    })
  })
  .catch((err) => {
    return new Promise((resolve, reject) => {
      reject(err)
    })
  })
}
