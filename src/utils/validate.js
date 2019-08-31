import _ from 'lodash'

import normalize from './normalize'
import checkDigit from './checkDigit'

const validate = (numbers, options, callback) => {
  options = options || {}
  callback = callback || _.noop

  if (_.isFunction(options)) {
    callback = options
    options = {}
  }

  if (!_.isArray(numbers)) {
    numbers = [numbers]
  }

  var passes = []
  var failures = []

  _.forEach(numbers, number => {
    var result = { numero: number }

    if (number == null) {
      result.error = 'Tracking number is null or undefined'
      return failures.push(result)
    }

    if (!_.isString(number)) {
      result.error = 'Tracking number is not a string'
      return failures.push(result)
    }

    var normalizedNumber = normalize(number)

    if (normalizedNumber.length === 0) {
      result.error = 'Tracking number is empty'
      return failures.push(result)
    }

    if (normalizedNumber.length !== 13) {
      result.error = 'Tracking number does not have 13 digits'
      return failures.push(result)
    }

    if (!/^[A-Z]{2}[0-9]{9}[A-Z]{2}$/.test(normalizedNumber)) {
      result.error = 'Tracking number does not match standard format'
      return failures.push(result)
    }

    if (options.checkDigit && !checkDigit(normalizedNumber)) {
      result.error = 'Tracking number check digit does not match'
      return failures.push(result)
    }

    passes.push(result)
  })

  callback(null, passes, failures)
  return failures.length === 0
}

export default validate
