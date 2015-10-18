var _ = require('lodash')

var JSONFormatter = {
  format: function format (items, failures) {
    var formattedItems = _.reduce(items, function (result, item) {
      return result + JSON.stringify(item._attributes)
    }, '')

    var formattedFailures = _.reduce(failures, function (result, failure) {
      return result + JSON.stringify(failure)
    }, '')

    return formattedItems + formattedFailures
  }
}

exports = module.exports = JSONFormatter
