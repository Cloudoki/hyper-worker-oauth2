'use strict'

const methods = require('./methods');

exports = module.exports = {};

exports.save = (msg, reply) => {
  methods.save(msg.payload).then((client) => {
    if (client) {
      let clientObj = client.serialize();

      reply({
        status: 201,
        payload: clientObj,
      });
      return;
    }

    reply({
      status: 404,
      payload: null
    })
  }).catch((err)=>{
    reply({
      status: 500,
      error: err
    });
  });
};

exports.find = (msg, reply) => {
  methods.find(msg.payload).then((client) => {
    if (client) {
      let clientObj = client.serialize();

      reply({
        status: 200,
        payload: clientObj,
      });
      return;
    }

    reply({
      status: 404,
      payload: null
    })
  }).catch((err)=>{
    reply({
      status: 500,
      error: err
    });
  });
};

exports.findByClientID = (msg, reply) => {
  methods.findByClientID(msg.payload).then((client) => {
    if (client) {
      let clientObj = client.serialize();

      reply({
        status: 200,
        payload: clientObj,
      });
      return;
    }

    reply({
      status: 404,
      payload: null
    })
  }).catch((err)=>{
    reply({
      status: 500,
      error: err
    });
  });
};

exports.update = (msg, reply) => {
    methods.update(msg.payload).then((client) => {
      if (client) {
        let clientObj = client.serialize();

        reply({
          status: 200,
          payload: clientObj
        });
        return
      }

    reply({
      status: 404,
      payload: null
    });

  }).catch((err) => {
    log.error(err);
    reply({
      status: 500,
      payload: err
    });
  });
};

exports.delete = (msg, reply) => {
  methods.delete(msg.payload).then((client) => {
    reply({
      status: 200,
      payload: null
    });
  }).catch((err) => {
    log.error(err);
    reply({
      status: 500,
      payload: err
    });
  });
};

exports.deleteByClientID = (msg, reply) => {
  methods.delete(msg.payload).then((client) => {
    reply({
      status: 200,
      payload: null
    });
  }).catch((err) => {
    log.error(err);
    reply({
      status: 500,
      payload: err
    });
  });
};
