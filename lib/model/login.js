'use strict'

const BaseModel = require('./base');

const instanceProps = {
  tableName: 'login',
  user: function () {
    return this.belongsTo(require('./users'))
  },
  account: function () {
    return this.belongsTo(require('./account'))
  }
};

const classProps = {
  typeName: 'login',
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
