const PrettyFormatter = {
  format: (items = [], failures = []) => {
    const formattedItems = items.reduce((result, item) => result + JSON.stringify(item, null, 2), '')
    const formattedFailures = failures.reduce((result, failure) => result + JSON.stringify(failure, null, 2), '')

    return formattedItems + formattedFailures
  }
}

export default PrettyFormatter
