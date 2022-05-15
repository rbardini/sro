const JSONFormatter = {
  format: (items = [], failures = []) => {
    const formattedItems = items.reduce((result, item) => result + JSON.stringify(item._attributes), '')
    const formattedFailures = failures.reduce((result, failure) => result + JSON.stringify(failure), '')

    return formattedItems + formattedFailures
  }
}

export default JSONFormatter
