'use strict'

const seneca = require('seneca')()
    .use('seneca-amqp-transport');

const config = require('config');
const log = require('util/logger');

const roles = [
    require('lib/listeners/client')
];

for (let role of roles) {
    for (let listener of role.listeners) {
        seneca.add(listener.pin, listener.handler);
    }
}

seneca.listen(config.get('seneca').client);