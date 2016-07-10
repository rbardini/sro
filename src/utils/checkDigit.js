const WEIGHTS = [8, 6, 4, 2, 3, 5, 9, 7]

const checkDigit = (number) => {
  var sum = WEIGHTS.reduce((sum, weight, i) => sum + number.charCodeAt(i + 2) * weight, 0)

  var mod = sum % 11
  var dv = mod === 0 ? 5 : mod === 1 ? 0 : 11 - mod

  return dv === +number.charAt(10)
}

export default checkDigit
