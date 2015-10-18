import _ from 'lodash'
import async from 'async'
import iconv from 'iconv-lite'
import request from 'request'
import xml2js from 'xml2js'

import formatters from './formatters'
import {Item} from './models/'

const ENDPOINT = 'http://websro.correios.com.br/sro_bin/sroii_xml.eventos'
const DEFAULTS = {usuario: 'ECT', senha: 'SRO', tipo: 'L', resultado: 'T'}

const normalize = number => number.trim().toUpperCase()

const checkDigit = number => {
  var sum = [8, 6, 4, 2, 3, 5, 9, 7].reduce((sum, weight, i) => sum + number.charCodeAt(i + 2) * weight, 0)

  var mod = sum % 11
  var dv = mod === 0 ? 5 : mod === 1 ? 0 : 11 - mod

  return dv === +number.charAt(10)
}

const track = function (numbers, options, callback) {
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

const validate = function (numbers, options, callback) {
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
    var result = {numero: number}

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

export default {track, validate, formatters}
