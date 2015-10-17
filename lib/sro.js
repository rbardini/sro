var _       = require("lodash"),
    async   = require("async"),
    iconv   = require("iconv-lite"),
    request = require("request"),
    xml2js  = require("xml2js");

var formatters = require("./formatters"),
    Item       = require("./models").Item;

var ENDPOINT = "http://websro.correios.com.br/sro_bin/sroii_xml.eventos",
    DEFAULTS = {usuario: "ECT", senha: "SRO", tipo: "L", resultado: "T"};

function normalize(number) {
  return number.trim().toUpperCase();
}

function checkDigit(number) {
  var sum = _.reduce([8, 6, 4, 2, 3, 5, 9, 7], function(sum, weight, i) {
    return sum + number.charCodeAt(i + 2) * weight;
  }, 0);

  var mod = sum % 11,
      dv  = mod === 0 ? 5 : mod === 1 ? 0 : 11 - mod;

  return dv == number.charAt(10);
}

function track(numbers, options, callback) {
  callback = callback || _.noop;
  options  = options || {};

  if (_.isFunction(options)) {
    callback = options;
    options  = {};
  }

  if (!_.isArray(numbers)) {
    numbers = [numbers];
  }

  var onProgress = _.isFunction(options.onProgress) ? options.onProgress : _.noop,
      tracked    = 0,
      items      = [],
      failures   = [],
      count;

  numbers = _(numbers)
    .filter(function(number) {
      return validate(number, options, function(err, pass, failure) {
        if (!pass.length) failures.push(failure[0]);
      });
    })
    .map(normalize)
    .uniq()
    .tap(function(numbers) { count = numbers.length; })
    .chunk(2)
    .value();

  async.each(numbers, function(chunk, callback) {
    var objetos = _.reduce(chunk, function(result, number) { return result + number; }),
        form    = _.defaults({objetos: objetos}, DEFAULTS);

    async.waterfall([
      function(callback) {
        request.post({uri: ENDPOINT, encoding: null, form: form}, callback);
      },

      function(response, body, callback) {
        xml2js.parseString(iconv.decode(body, "iso-8859-1"), {
          explicitArray: false,
          explicitRoot:  false,
          normalize:     true,
          normalizeTags: true,
          strict:        false,
          trim:          true
        }, callback);
      },

      function(result, callback) {
        var objetos = _.flatten([result.objeto]),
            items   = [];

        items = _.map(chunk, function(number) {
          var objeto = _.find(objetos, function(objeto) {
            return objeto && objeto.numero === number;
          });
          return new Item(number, objeto);
        });

        callback(null, items);
      }],

      function(err, result) {
        if (!err) {
          _.forEach(result, function(item) {
            items.push(item);
            onProgress(++tracked / count, item);
          });
        }

        callback(err);
      }
    );

  }, function(err) {
    if (err) {
      callback(err);
    } else {
      callback(null, items, failures);
    }
  });
}

function validate(numbers, options, callback) {
  callback = callback || _.noop;
  options  = options || {};

  if (_.isFunction(options)) {
    callback = options;
    options  = {};
  }

  if (!_.isArray(numbers)) {
    numbers = [numbers];
  }

  var passes   = [],
      failures = [];

  _.forEach(numbers, function(number) {
    var result = {numero: number};

    if (number == null) {
      result.error = "Tracking number is null or undefined";
      return failures.push(result);
    }

    if (!_.isString(number)) {
      result.error = "Tracking number is not a string";
      return failures.push(result);
    }

    var normalizedNumber = normalize(number);

    if (normalizedNumber.length === 0) {
      result.error = "Tracking number is empty";
      return failures.push(result);
    }

    if (normalizedNumber.length !== 13) {
      result.error = "Tracking number does not have 13 digits";
      return failures.push(result);
    }

    if (!/^[A-Z]{2}[0-9]{9}[A-Z]{2}$/.test(normalizedNumber)) {
      result.error = "Tracking number does not match standard format";
      return failures.push(result);
    }

    if (options.checkDigit && !checkDigit(normalizedNumber)) {
      result.error = "Tracking number check digit does not match";
      return failures.push(result);
    }

    passes.push(result);
  });

  callback(null, passes, failures);
  return failures.length === 0;
}

exports.track      = track;
exports.validate   = validate;
exports.formatters = formatters;
