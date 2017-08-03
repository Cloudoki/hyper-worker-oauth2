'use strict'

const handlers = require('./handlers');

exports = module.exports = {};

exports.consumers = [{
  queue: {
    name: 'hyper.client.save',
    options: {
      durable: false
    }
  },
  async: false,
  handler: handlers.save
},
{
  queue: {
    name: 'hyper.client.find',
    options: {
      durable: false
    }
  },
  async: false,
  handler: handlers.find
},
{
  queue: {
    name: 'hyper.client.findByClientID',
    options: {
      durable: false
    }
  },
  async: false,
  handler: handlers.findByClientID
},
{
  queue: {
    name: 'hyper.client.update',
    options: {
      durable: false
    }
  },
  async: false,
  handler: handlers.update
},
{
  queue: {
    name: 'hyper.client.delete',
    options: {
      durable: false
    }
  },
  async: false,
  handler: handlers.delete
},
{
  queue: {
    name: 'hyper.client.deleteByClientID',
    options: {
      durable: false
    }
  },
  async: false,
  handler: handlers.deleteByClientID
}];
