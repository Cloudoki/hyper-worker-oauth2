'use strict'

const hyperError = require('hyper-error')

const log = require('util/logger')
const methods = require('./methods')

exports = module.exports = {}

exports.hash = (msg, done) => {
  methods.hash(msg.data)
  .then((hash) => {
    done(null, {
      data: hash
    })
  }).catch((err) => {
    log.error(err)
    done(null, {
      err: hyperError.isHyperError(err) ? err : new hyperError.Internal()
    })
  })
}

exports.login = (msg, done) => {
  methods.login(msg.data.username, msg.data.password)
  .then((user) => {
    done(null, {
      data: user
    })
  }).catch((err) => {
    log.error(err)
    done(null, {
      err: hyperError.isHyperError(err) ? err : new hyperError.Internal()
    })
  })
}

exports.token = (msg, done) => {
  methods.token(msg.data.userID, msg.data.accountID)
  .then((token) => {
    if (token) {
      done(null, {
        data: token
      })
      return
    }
    done(null, {})
  }).catch((err) => {
    log.error(err)
    done(null, {
      err: hyperError.isHyperError(err) ? err : new hyperError.Internal()
    })
  })
}

exports.validateLoginToken = (msg, done) => {
  methods.validateLoginToken(msg.data.token)
  .then((valid) => {
    done(null, {
      data: valid
    })
  }).catch((err) => {
    log.error(err)
    done(null, {
      err: hyperError.isHyperError(err) ? err : new hyperError.Internal()
    })
  })
}

exports.password = (msg, done) => {
  methods.password(msg.data.clientID, msg.data.userID, msg.data.scope, msg.data.grant)
  .then((token, refreshToken, expiresIn) => {
    done(null, {
      data: {
        token,
        refreshToken,
        expiresIn
      }
    })
  }).catch((err) => {
    log.error(err)
    done(null, {
      err: hyperError.isHyperError(err) ? err : new hyperError.Internal()
    })
  })
}

exports.implicit = (msg, done) => {
  methods.implicit(msg.data.clientID, msg.data.userID, msg.data.grant)
  .then((token, expiresIn) => {
    done(null, {
      data: {
        token,
        expiresIn
      }
    })
  }).catch((err) => {
    log.error(err)
    done(null, {
      err: hyperError.isHyperError(err) ? err : new hyperError.Internal()
    })
  })
}

exports.client_credencials = (msg, done) => {
  // {Object} client.clientID, client.clientSecret, client.redirectURI
  methods.client_credencials(msg.data.client, msg.data.scope, msg.data.grant)
  .then((token, expiresIn) => {
    done(null, {
      data: {
        token,
        expiresIn
      }
    })
  }).catch((err) => {
    log.error(err)
    done(null, {
      err: hyperError.isHyperError(err) ? err : new hyperError.Internal()
    })
  })
}

exports.authorization_code = (msg, done) => {
  methods.authorization_code(msg.data.clientID, msg.data.userID, msg.data.scope, msg.data.grant)
  .then((code, redirectURI) => {
    done(null, {
      data: {
        code,
        redirectURI
      }
    })
  }).catch((err) => {
    log.error(err)
    done(null, {
      err: hyperError.isHyperError(err) ? err : new hyperError.Internal()
    })
  })
}

exports.authorization_code_exchange = (msg, done) => {
  methods.authorization_code_exchange(msg.data.clientID, msg.data.code, msg.data.redirectURI, msg.data.makeRefresh)
  .then((token, refreshToken, expiresIn) => {
    done(null, {
      data: {
        token,
        refreshToken,
        expiresIn
      }
    })
  }).catch((err) => {
    log.error(err)
    done(null, {
      err: hyperError.isHyperError(err) ? err : new hyperError.Internal()
    })
  })
}

exports.refreshToken = (msg, done) => {
  methods.refreshToken(msg.data.clientID, msg.data.code, msg.data.redirectURI, msg.data.makeRefresh)
  .then((token, expiresIn) => {
    done(null, {
      data: {
        token,
        expiresIn
      }
    })
  }).catch((err) => {
    log.error(err)
    done(null, {
      err: hyperError.isHyperError(err) ? err : new hyperError.Internal()
    })
  })
}
