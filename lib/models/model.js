var _ = require('lodash')

var Model = (function () {
  function Model (attributes) {
    this._attributes = attributes || {}
  }

  Model.prototype.set = function (name, attr) {
    return (this._attributes[name] = attr)
  }

  Model.prototype.unset = function (name, attr) {
    return this.set(name, void 0)
  }

  Model.prototype.get = function (attr) {
    return this._attributes[attr]
  }

  Model.prototype.has = function (attr) {
    return this.get(attr) != null
  }

  Model.prototype.forEach = function (iteratee) {
    return _.forEach(this._attributes, iteratee, this)
  }

  Model.prototype.compact = function () {
    this.forEach(function (value, name) {
      if (_.isString(value) && _.isEmpty(value.trim())) {
        this.unset(name)
      }
    })
  }

  Model.prototype.toJSON = function () {
    return _.clone(this._attributes)
  }

  return Model
})()

exports = module.exports = Model
