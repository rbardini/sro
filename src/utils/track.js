import _ from 'lodash'
import async from 'async'
import iconv from 'iconv-lite'
import request from 'request'
import xml2js from 'xml2js'

import {Item} from '../models/'
import normalize from './normalize'
import validate from './validate'

const ENDPOINT = 'http://websro.correios.com.br/sro_bin/sroii_xml.eventos'
const DEFAULTS = {usuario: 'ECT', senha: 'SRO', tipo: 'L', resultado: 'T'}

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

  var onProgress = _.isFunction(options.onProgress) ? options.onProgress : _.noop
  var tracked = 0
  var items = []
  var failures = []
  var count

  numbers = _(numbers)
    .filter(number => validate(number, options, (err, pass, failure) => {
      if (err) throw err
      if (!pass.length) failures.push(failure[0])
    }))
    .map(normalize)
    .uniq()
    .tap(numbers => { count = numbers.length })
    .chunk(2)
    .value()

  async.each(numbers, (chunk, callback) => {
    var objetos = _.reduce(chunk, (result, number) => result + number)
    var form = _.defaults({objetos: objetos}, DEFAULTS)

    async.waterfall([
      function (callback) {
        request.post({uri: ENDPOINT, encoding: null, form}, callback)
      },

      function (response, body, callback) {
        xml2js.parseString(iconv.decode(body, 'iso-8859-1'), {
          explicitArray: false,
          explicitRoot: false,
          normalize: true,
          normalizeTags: true,
          strict: false,
          trim: true
        }, callback)
      },

      function (result, callback) {
        var objetos = _.flatten([result.objeto])
        var items = []

        items = _.map(chunk, number => {
          var objeto = _.find(objetos, objeto => objeto && objeto.numero === number)
          return new Item(number, objeto)
        })

        callback(null, items)
      }],

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
