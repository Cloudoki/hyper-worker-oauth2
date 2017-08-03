'use strict'
// Database configuration is in the config.js file.
const config = require('./config')

const knexConfig = {
  client: 'mysql',
  connection: config.get('database').options,
  pool: config.get('database').pool
}

module.exports = {
  default: knexConfig,
  development: knexConfig,
  staging: knexConfig,
  production: knexConfig
}