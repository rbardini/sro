var _ = require("lodash");

var Model = require("./model");

var Event = (function() {

  function Event(attributes) {
    Model.call(this, attributes);

    this._normalize();
    this._date = this._createDate();

    this.compact();
  }

  Event.prototype = Object.create(Model.prototype);
  Event.prototype.constructor = Event;

  Event.prototype.date = function() {
    return this._date;
  };

  Event.prototype._normalize = function() {
    var descricao = this.get("descricao");

    if (_.isPlainObject(descricao)) {
      // The 'descricao' field sometimes contains unclosed tags,
      // so replace it by its character content
      this.set("descricao", descricao._ || "");
    }
  };

  Event.prototype._createDate = function() {
    var data = this.get("data").split("/"),
        hora = this.get("hora").split(":");

    var day  = data[0], month  = data[1], year = data[2],
        hour = hora[0], minute = hora[1];

    return new Date(year, month - 1, day, hour, minute);
  };


  return Event;

})();

exports = module.exports = Event;
