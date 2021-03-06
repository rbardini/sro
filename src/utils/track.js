import _ from 'lodash'
import async from 'async'
import xml2js from 'xml2js'

import { Item } from '../models/index.js'
import normalize from './normalize.js'
import validate from './validate.js'
import apiRequest from './apiRequest.js'

const track = (numbers, options, callback) => {
  options = options || {}
  callback = callback || _.noop

  if (_.isFunction(options)) {
    callback = options
    options = {}
  }

  if (!_.isArray(numbers)) {
    numbers = [numbers]
  }

  const onProgress = _.isFunction(options.onProgress) ? options.onProgress : _.noop
  let tracked = 0
  const items = []
  const failures = []
  let count

  numbers = _(numbers)
    .filter(number => validate(number, options, (err, pass, failure) => {
      if (err) throw err
      if (!pass.length) failures.push(failure[0])
    }))
    .map(normalize)
    .uniq()
    .tap(numbers => { count = numbers.length })
    .chunk(20)
    .value()

  async.each(numbers, (chunk, callback) => {
    async.waterfall([
      function (callback) {
        apiRequest({ objetos: chunk }, callback)
      },

      function (response, body, callback) {
        xml2js.parseString(body, {
          async: true,
          explicitArray: false,
          explicitRoot: false,
          ignoreAttrs: true,
          normalize: true,
          normalizeTags: true,
          trim: true,
          tagNameProcessors: [name => name.substr(name.indexOf(':') + 1)]
        }, callback)
      },

      function (result, callback) {
        const objetos = _.flatten([result.body.buscaeventoslistaresponse.return.objeto])
        const items = _.map(chunk, number => {
          const objeto = _.find(objetos, objeto => objeto && objeto.numero === number)
          return new Item(number, objeto)
        })

        callback(null, items)
      }
    ],

    function (err, result) {
      if (!err) {
        _.forEach(result, item => {
          items.push(item)
          onProgress(++tracked / count, item)
        })
      }

      callback(err)
    }
    )
  }, function (err) {
    if (err) {
      callback(err)
    } else {
      callback(null, items, failures)
    }
  })
}

export default track
