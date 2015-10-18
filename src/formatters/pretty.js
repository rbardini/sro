import _ from 'lodash'

const PrettyFormatter = {
  format: (items, failures) => {
    var formattedItems = _.reduce(items, (result, item) => result + JSON.stringify(item._attributes, null, 2), '')
    var formattedFailures = _.reduce(failures, (result, failure) => result + JSON.stringify(failure, null, 2), '')

    return formattedItems + formattedFailures
  }
}

export default PrettyFormatter
