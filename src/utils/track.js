import normalizeItem from './normalizeItem.js'
import normalizeNumber from './normalizeNumber.js'
import validate from './validate.js'
import apiRequest from './apiRequest.js'

const track = (numbers, options = {}, callback = () => {}) => {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }

  if (!Array.isArray(numbers)) {
    numbers = [numbers]
  }

  const items = []
  const failures = []

  numbers = numbers
    .filter(number =>
      validate(number, options, (err, pass, failure) => {
        if (err) throw err
        if (!pass.length) failures.push(failure[0])
      })
    )
    .map(normalizeNumber)

  let tracked = 0
  const count = numbers.length
  const chunks = numbers.reduce((acc, number) => {
    if (acc.length === 0 || acc[acc.length - 1].length === 20) acc.push([])
    return acc[acc.length - 1].push(number) && acc
  }, [])

  Promise.all(
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
    .then(() => callback(null, items, failures))
    .catch(err => callback(err))
}

export default track
