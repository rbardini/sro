export default (items = [], failures = []) => {
  const formattedItems = items.reduce(
    (result, item) => result + JSON.stringify(item),
    ''
  )
  const formattedFailures = failures.reduce(
    (result, failure) => result + JSON.stringify(failure),
    ''
  )

  return formattedItems + formattedFailures
}
