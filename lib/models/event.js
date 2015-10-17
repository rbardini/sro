var _ = require('lodash')
var util = require('util')

var Model = require('./model')

var Event = (function () {
  function Event (attributes) {
    Event.super_.call(this, attributes)

    this._normalize()
    this._date = this._createDate()

    this.compact()
  }

  util.inherits(Event, Model)

  Event.prototype.date = function () {
    return this._date
  }

  Event.prototype._normalize = function () {
    var descricao = this.get('descricao')

    if (_.isPlainObject(descricao)) {
      // The 'descricao' field sometimes contains unclosed tags,
      // so replace it by its character content
      this.set('descricao', descricao._ || '')
    }
  }

  Event.prototype._createDate = function () {
    var data = this.get('data').split('/')
    var hora = this.get('hora').split(':')

    var day = data[0]
    var month = data[1]
    var year = data[2]
    var hour = hora[0]
    var minute = hora[1]

    return new Date(year, month - 1, day, hour, minute)
  }

  return Event
})()

exports = module.exports = Event
