const bcrypt = require('bcrypt');
const saltRounds = 10;
const config = require('../../config');
const db_methods = require('./db_methods');
const utils = require('./utils');
const validate = require('./validate');
const grantTypes = [ 'authorization_code', 'client_credencials', 'implicit', 'password' ];
const expiresIn = config.oauth2.token_expiresIn;

exports = module.exports = {};

/**
* Validate if text and hash match.
* @param {String} plainText - The text that was hashed
* @param {String} hash - The hash
* @returns {Boolean} true if valid, false otherwise.
*/
const checkHash = function(plainText, hash) {
  bcrypt.compare(plainText, hash, function(err, res) {
    return new Promise((resolve, reject) => {
      if (err) {
        reject(new hyperError.InvalidPassword('Password validation failed.'));
        return;
      }
      resolve(res);
    });
  });
};

/**
* Validate if grant is valid
* @param {String} grant - The grant that was requested
* @returns {Boolean} true if valid, false otherwise.
*/
const validateGrant = function(grant) {
  return grantTypes.includes(grant);
}

/**
* Hashes the text received.
* @param {String} plainText - The text to hash
* @returns {String} The hashed text
*/
exports.hash = function(plainText) {
  bcrypt.hash(plainText, saltRounds, function(err, hash) {
    return new Promise((resolve, reject) => {
      if (err) {
        reject(new hyperError.HashFailed('Failed to create the hash.'));
        return;
      }
      resolve(hash);
    });
  });
};

/**
* Validate the user login
* @param {String} username - The username
* @param {String} password - The user password
* @returns {Boolean} If the username/password is valid true, false if not
*/
exports.login = function(username, password) {
  db_methods.users.findByUsername(username)
  .then((user) => {
    return new Promise((resolve, reject) => {
      if (user) {
        return checkHash(password, user.password);
      }
      reject(new hyperError.NotFound('User was not found.'));
    });
  })
  .catch((err) => {
    return new Promise((resolve, reject) => {
      reject(err);
    });
  });
};

/**
* Generate a token for the login
*/
exports.token = function(userID, accountID) {
  const token         = utils.createToken({ sub : userID, exp : config.oauth2.loginToken_expiresIn });
  const expiration    = config.token.calculateExpirationDate();
  db_methods.loginToken.save({
    userID,
    accountID,
    token,
    expirationDate: expiration
  })
  .then((loginTokenData) => {
    return new Promise((resolve, reject) => {
      if (!loginTokenData) {
        reject(new hyperError.SaveFailed('Failed to save the login token.'));
        return;
      }
      resolve(token);
    });
  })
  .catch((err) => {
    return new Promise((resolve, reject) => {
      reject(err);
    });
  });
};

/**
* Validate a token for the login
*/
exports.validateLoginToken = function(token, done) {
  db_methods.loginToken.find(token)
  .then(loginTokenData => {
    if (loginTokenData) {
      if (loginTokenData.expiration_date > new Date()) {
        db_methods.loginToken.delete(token)
        .then(() => {
          return new Promise((resolve, reject) => {
            reject(new hyperError.ExpiredToken());
          });
        })
        .catch((err) => {
          return new Promise((resolve, reject) => {
            reject(err);
          });
        });
      }
      resolve(true)
    } else {
      return new Promise((resolve, reject) => {
        reject(new hyperError.NotFound());
      });
    }
  })
  .catch((err) => {
    return new Promise((resolve, reject) => {
      reject(err);
    });
  });
}

/**
 * Exchange user id and password for access tokens.
 */
exports.password = function(clientID, userID, scope, grant, done) {
  if(!validateGrant(grant) || grant !== 'password') {
    return new Promise((resolve, reject) => {
      reject(new hyperError.InvalidGrant());
    });
  }
  validate.generateTokens({ scope, userID, clientID })
  .then((tokens) => {
    return new Promise((resolve, reject) => {
      if (tokens === false) {
        reject(new hyperError.TokensNotGenerated());
        return;
      }
      if (tokens.length === 1) {
        resolve(tokens[0], null, expiresIn);
        return;
      }
      if (tokens.length === 2) {
        resolve(tokens[0], tokens[1], expiresIn);
        return;
      }
      reject(new hyperError.ExchangeFailed('Error exchanging password for tokens'));
    });
  })
  .catch((err) => {
    return new Promise((resolve, reject) => {
      reject(err);
    });
  });
};

/**
* Grant implicit authorization
*/
exports.implicit = function(clientID, userID, grant, done) {
  if(!validateGrant(grant) || grant !== 'implicit') {
    return new Promise((resolve, reject) => {
      reject(new hyperError.InvalidGrant());
    });
  }
  db_methods.clients.findByClientID(clientID)
  .then((localClient) => {
    return new Promise((resolve, reject) => {
      if (localClient) {
        const token = utils.createToken({ sub: userID, exp: expiresIn });
        const expiration = utils.calculateExpirationDate(expiresIn);
        const access_token = {
          token,
          clientID,
          userID,
          expirationDate: expiration,
          scope: localClient.scope
        };
        db_methods.accessTokens.save(access_token)
        .then(() => resolve(token, expiresIn))
        .catch((err) => reject(err));
      } else {
        reject(new hyperError.NotFound('Client was not found.'));
      }
    });
  })
  .catch((err) => {
    return new Promise((resolve, reject) => {
      reject(err);
    });
  });
};

/**
 * Exchange the client id and password/secret for an access token.
 */
exports.client_credencials = function(client, scope, grant, done) {
  if(!validateGrant(grant) || grant !== 'client_credencials') {
    return new Promise((resolve, reject) => {
      reject(new hyperError.InvalidGrant());
    });
  }
  db_methods.clients.findByClientID(client.clientID)
  .then((localClient) => {
    return new Promise((resolve, reject) => {
      if (localClient.redirectURI !== client.redirectURI) {
        reject(new hyperError.InvalidRedirectURI('Redirect URI does not match'));
        return;
      }
      if (localClient.clientSecret !== client.clientSecret) {
        reject(new hyperError.InvalidSecret('Client secret does not match'));
        return;
      }
      const token        = utils.createToken({ sub : client.id, exp : expiresIn });
      const expiration   = utils.calculateExpirationDate(expiresIn);
      const access_token = {
        token,
        clientID: client.id,
        userID: null, // null since there is no user when using this grant type
        expirationDate: expiration,
        scope: client.scope
      };
      db_methods.accessTokens.save(access_token)
      .then(() => resolve(token, null, expiresIn))
      .catch(err => reject(err));
    });
  })
  .catch(err => {
    return new Promise((resolve, reject) => {
      reject(err);
    });
  });
};

/**
* Grant authorization code
*/
exports.authorization_code = function(clientID, userID, scope, grant, done) {
  if(!validateGrant(grant) || grant !== 'authorization_code') {
    return new Promise((resolve, reject) => {
      reject(new hyperError.InvalidGrant());
    });
  }
  db_methods.clients.findByClientID(clientID)
  .then((localClient) => {
    if (localClient) {
      return new Promise((resolve, reject) => {
        const code = utils.createToken({ sub: userID, exp: config.oauth2.code_expiresIn });
        const authorization_code = {
          code,
          clientID,
          redirectURI: localClient.redirectURI,
          userID,
          scope
        };
        db_methods.authorizationCodes.save(authorization_code)
        .then(() => resolve(code, localClient.redirectURI))
        .catch((err) => reject(err));
      });
    } else {
      reject(new hyperError.NotFound('Invalid client id'));
    }
  })
  .catch((err) => {
    return new Promise((resolve, reject) => {
      reject(err);
    });
  });
};

/**
 * Exchange authorization code for access tokens.
 */
exports.authorization_code_exchange = function(clientID, code, redirectURI, makeRefresh, done) {
  db_methods.authorizationCodes.delete(code)
  .then(authCode => validate.authCode(code, authCode, clientID, redirectURI))
  .then(authCode => {
    authCode.refresh = makeRefresh ? true : false;
    return validate.generateTokens(authCode)
  })
  .then((tokens) => {
    return new Promise((resolve, reject) => {
      if (tokens.length === 1) {
        resolve(tokens[0], null, expiresIn);
        return;
      }
      if (tokens.length === 2) {
        resolve(tokens[0], tokens[1], expiresIn);
        return;
      }
      reject(new hyperError.ExchangeFailed('Error exchanging auth code for tokens'));
    });
  })
  .catch((err) => {
    return new Promise((resolve, reject) => {
      reject(err);
    });
  });
};

/**
 * Exchange the refresh token for an access token.
 */
exports.refreshToken = function(client, refreshToken, scope, done) {
  db_methods.refreshTokens.find(refreshToken)
  .then(foundRefreshToken => validate.refreshToken(foundRefreshToken, refreshToken, client))
  .then(foundRefreshToken => validate.generateToken(foundRefreshToken))
  .then(token => {
    return new Promise((resolve, reject) => {
      resolve(token, null, expiresIn);
    });
  })
  .catch((err) => {
    return new Promise((resolve, reject) => {
      reject(err);
    });
  });
};
