import checkDigit from './utils/checkDigit.js'
import normalizeNumber from './utils/normalizeNumber.js'

export default (numbers, options = {}) => {
  if (!Array.isArray(numbers)) {
    numbers = [numbers]
  }

  const passes = []
  const failures = []

  numbers.forEach(number => {
    const result = { numero: number }

    if (number == null) {
      result.error = 'Tracking number is null or undefined'
      return failures.push(result)
    }

    if (typeof number !== 'string') {
      result.error = 'Tracking number is not a string'
      return failures.push(result)
    }

    const normalizedNumber = normalizeNumber(number)

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

  return [passes, failures]
}
