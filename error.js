module.exports = function ConfigError(name, message) {
  this.message = message;
  this.name = name;
}