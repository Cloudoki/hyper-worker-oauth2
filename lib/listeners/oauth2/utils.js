'use strict'

const fs = require('fs')
const path = require('path')
const uuid = require('uuid/v4')
const jwt = require('jsonwebtoken')

/** Private certificate used for signing JSON WebTokens */
const privateKey = fs.readFileSync(path.join(__dirname, 'certs/private_key.pem'))

/** Public certificate used for verification */
const publicKey = fs.readFileSync(path.join(__dirname, 'certs/certificate.pem'))

// sign with RSA SHA256
exports.createToken = (options) => {
  const exp = options.exp || 3600
  const sub = options.sub || ''
  const token = jwt.sign({
    jti: uuid(),
    sub,
    exp: Math.floor(Date.now() / 1000) + exp
  }, privateKey, {
    algorithm: 'RS256'
  })

  return token
}

exports.verifyToken = token => jwt.verify(token, publicKey)

exports.calculateExpirationDate = expireIn => new Date(Date.now() + (expireIn * 1000))
