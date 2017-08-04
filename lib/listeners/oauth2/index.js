'use strict'

const handlers = require('./handlers')

exports = module.exports = {}

exports.listeners = [{
  pin: 'role:oauthFlow,cmd:hash',
  handler: handlers.hash
},
{
  pin: 'role:oauthFlow,cmd:login',
  handler: handlers.login
},
{
  pin: 'role:oauthFlow,cmd:validateLoginToken',
  handler: handlers.validateLoginToken
},
{
  pin: 'role:oauthFlow,cmd:password',
  handler: handlers.password
},
{
  pin: 'role:oauthFlow,cmd:implicit',
  handler: handlers.implicit
},
{
  pin: 'role:oauthFlow,cmd:client_credencials',
  handler: handlers.client_credencials
},
{
  pin: 'role:oauthFlow,cmd:authorization_code',
  handler: handlers.authorization_code
},
{
  pin: 'role:oauthFlow,cmd:authorization_code_exchange',
  handler: handlers.authorization_code_exchange
},
{
  pin: 'role:oauthFlow,cmd:refreshToken',
  handler: handlers.refreshToken
}]
