'use strict'

const handlers = require('./handlers');

exports = module.exports = {};

exports.listeners = [{
    pin: 'role:oauthClient,cmd:get',
    handler: handlers.get
  },
  {
    pin: 'role:oauthClient,cmd:list',
    handler: handlers.list
  },
  {
    pin: 'role:oauthClient,cmd:add',
    handler: handlers.add
  },
  {
    pin: 'role:oauthClient,cmd:update',
    handler: handlers.update
  },
  {
    pin: 'role:oauthClient,cmd:delete',
    handler: handlers.delete
  }];
