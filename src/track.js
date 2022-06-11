import apiRequest from './utils/apiRequest.js'
import normalizeItem from './utils/normalizeItem.js'
import normalizeNumber from './utils/normalizeNumber.js'
import validate from './validate.js'

export default async (numbers, options = {}) => {
  if (!Array.isArray(numbers)) {
    numbers = [numbers]
  }

  const items = []
  const failures = []

  numbers = await numbers.reduce(async (acc, number) => {
    const [, failure] = await validate(number, options)
    const hasFailure = failure.length !== 0

    if (hasFailure) return failures.push(failure[0]) && acc
    return (await acc).concat(normalizeNumber(number))
  }, [])

  let tracked = 0
  const count = numbers.length
  const chunks = numbers.reduce((acc, number) => {
    if (acc.length === 0 || acc[acc.length - 1].length === 20) acc.push([])
    return acc[acc.length - 1].push(number) && acc
  }, [])

  await Promise.all(
    chunks.map(async chunk => {
      const response = await apiRequest({ objetos: chunk })
      const objetos = [response.objeto].flat().filter(Boolean)

      chunk
        .map(number =>
          normalizeItem(objetos.find(({ numero }) => numero === number))
        )
        .forEach(item => {
          items.push(item)
          if (options.onProgress) options.onProgress(++tracked / count, item)
        })
    })
  )

  return [items, failures]
}
