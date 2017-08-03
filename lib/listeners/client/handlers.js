'use strict'

const hyperError = require('hyper-error');

const log = require('util/logger');
const methods = require('./methods');
const presenter = require('lib/presenters/client');

exports = module.exports = {};

exports.get = (msg, done) => {

    methods.get(msg.data).then((client) => {

        if (!client) {
            done(null, {
                err: new hyperError.NotFound()
            });
            return
        }

        done(null, {
            data: presenter.toJson(client)
        });

    }).catch((err) => {
        log.error(err);
        done(null, {
            err: hyperError.isHyperError(err) ? err : new hyperError.Internal()
        });
    });

};

exports.list = (msg, done) => {

    methods.list(msg.data).then((client) => {

        if (!client) {
            done(null, {});
            return
        }

        done(null, {
            data: presenter.toJson(client)
        });

    }).catch((err) => {
        log.error(err);
        done(null, {
            err: hyperError.isHyperError(err) ? err : new hyperError.Internal()
        });
    });

};

exports.add = (msg, done) => {

    methods.add(msg.data).then((client) => {

        if (!client) {
            done(null, {});
            return
        }

        done(null, {
            data: presenter.toJson(client)
        });

    }).catch((err) => {
        log.error(err);
        done(null, {
            err: hyperError.isHyperError(err) ? err : new hyperError.Internal()
        });
    });

};

exports.update = (msg, done) => {
    
    methods.update(msg.data).then((client) => {

        if (!client) {
            done(null, {});
            return
        }

        done(null, {
            data: presenter.toJson(client)
        });

    }).catch((err) => {
        log.error(err);
        done(null, {
            err: hyperError.isHyperError(err) ? err : new hyperError.Internal()
        });
    });

};

exports.delete = (msg, done) => {

    methods.delete(msg.data).then((client) => {

        if (!client) {
            done(null, {});
            return
        }

        done(null, {});

    }).catch((err) => {
        log.error(err);
        done(null, {
            err: hyperError.isHyperError(err) ? err : new hyperError.Internal()
        });
    });

};
