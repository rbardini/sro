const WEIGHTS = [8, 6, 4, 2, 3, 5, 9, 7]

export default number => {
  const sum = WEIGHTS.reduce(
    (sum, weight, i) => sum + number.charCodeAt(i + 2) * weight,
    0
  )

  const mod = sum % 11
  const dv = mod === 0 ? 5 : mod === 1 ? 0 : 11 - mod

  return dv === +number.charAt(10)
}
