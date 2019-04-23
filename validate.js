'use strict'
var ConfigError = require('./error')
var regex = new RegExp('^[a-zA-Z0-9_.-]{3,255}$');

var validate = function (options, field) {
  if (!regex.test(options[field] || '')) {
    throw new ConfigError('InvalidConfig', field + 
    '.tableName must follow AWS naming rules (3-255 length, and only the following characters: a-z, A-Z, 0-9, _-.)')
  }
  return true
}

module.exports.config = function (options) {
  return validate(options, 'source') && validate(options, 'destination') // check both source and destination
}