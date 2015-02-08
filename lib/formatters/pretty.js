var _ = require("lodash");

var PrettyFormatter = {
  format: function format(items, failures) {
    var formattedItems = _.reduce(items, function(result, item) {
      return result + JSON.stringify(item._attributes, null, 2);
    }, "");

    var formattedFailures = _.reduce(failures, function(result, failure) {
      return result + JSON.stringify(failure, null, 2);
    }, "");

    return formattedItems + formattedFailures;
  }
};

exports = module.exports = PrettyFormatter;
