var _         = require("lodash"),
    countries = require("country-data").countries;

var Model = require("./model"),
    Event = require("./event");

var SERVICES = require("../../data/services.json");

var Item = (function() {

  function Item(number, attributes) {
    Model.call(this, attributes);

    this._normalize(number);
    this._events = this._createEvents();
  }

  Item.prototype = Object.create(Model.prototype);
  Item.prototype.constructor = Item;

  Item.prototype.number = function() {
    return this.get("numero");
  };

  Item.prototype.serviceCode = function() {
    return this.number().slice(0, 2);
  };

  Item.prototype.service = function() {
    return SERVICES[this.serviceCode()];
  };

  Item.prototype.countryCode = function() {
    return this.number().slice(-2);
  };

  Item.prototype.countryName = function() {
    return (this.country() || {}).name;
  };

  Item.prototype.country = function() {
    return countries[this.countryCode()];
  };

  Item.prototype.events = function() {
    return this._events;
  };

  Item.prototype.status = function() {
    return this.events()[0];
  };

  Item.prototype.found = function() {
    return this.status() != null;
  };

  Item.prototype._normalize = function(number) {
    _.defaults(this._attributes, {numero: number, evento: []});
  };

  Item.prototype._createEvents = function() {
    return this.get("evento").map(function(event) {
      return new Event(event);
    });
  };

  return Item;

})();

exports = module.exports = Item;
