'use strict'

const BaseModel = require('./base');

const instanceProps = {
  tableName: 'oauth_access_tokens',
  user: function () {
    return this.belongsTo(require('./user'))
  },
  client: function () {
    return this.belongsTo(require('./clients'))
  }
};

const classProps = {
  typeName: 'oauth_access_tokens',
  filters: {
    // name: function (qb, value) {
    //   return qb.whereIn('name', value)
    // }
  },
  //dependents: ['blm-model-relation-dep'],
  relations: [
    // 'keywords'
  ]
};

exports = module.exports = BaseModel.extend(instanceProps, classProps);
