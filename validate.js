'use strict'
var ConfigError = require('./error')

var validate = function (options, field) {
  if (options[field] === undefined) {
    throw new ConfigError('InvalidConfig', field + ' is required')
  }
  if (options[field].tableName === undefined) {
    throw new ConfigError('InvalidConfig', field + '.tableName is required')
  }
  if (typeof options[field].tableName !== 'string') {
    throw new ConfigError('InvalidConfig', field + '.tableName should be string')
  }
  if (typeof options[field].tableName.length === 0) {
    throw new ConfigError('InvalidConfig', field + '.tableName length should be more than 0')
  }
}

module.exports.config = function (options) {
  return validate(options, 'source') && validate(options, 'destination') // check both source and destination
}