import _ from 'lodash'

const PrettyFormatter = {
  format: (items, failures) => {
    const formattedItems = _.reduce(items, (result, item) => result + JSON.stringify(item._attributes, null, 2), '')
    const formattedFailures = _.reduce(failures, (result, failure) => result + JSON.stringify(failure, null, 2), '')

    return formattedItems + formattedFailures
  }
}

export default PrettyFormatter
