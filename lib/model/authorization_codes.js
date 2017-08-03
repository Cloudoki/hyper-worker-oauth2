'use strict'

const BaseModel = require('./base');

const instanceProps = {
  tableName: 'oauth_access_tokens',
  client: function () {
    return this.belongsTo(require('./clients'));
  },
  user: function () {
    return this.belongsTo(require('./user'))
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
