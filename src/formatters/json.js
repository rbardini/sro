import _ from 'lodash'

const JSONFormatter = {
  format: (items, failures) => {
    const formattedItems = _.reduce(items, (result, item) => result + JSON.stringify(item._attributes), '')
    const formattedFailures = _.reduce(failures, (result, failure) => result + JSON.stringify(failure), '')

    return formattedItems + formattedFailures
  }
}

export default JSONFormatter
