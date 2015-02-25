SRO
===

[![npm package version](https://img.shields.io/npm/v/sro.svg)](https://www.npmjs.com/package/sro)
[![Build status](https://img.shields.io/travis/rbardini/sro.svg)](https://travis-ci.org/rbardini/sro)
[![Dependency status](https://img.shields.io/david/rbardini/sro.svg)](https://david-dm.org/rbardini/sro)

Friendly Correios SRO API wrapper and command-line utility.

## Installation

    $ npm install sro

## Usage

```js
var sro = require("sro");

sro.track("SS123456789BR", function(err, items, failures) {
  if (err) throw err;

  items.forEach(function(item) {
    var status = item.status();
    if (status != null) console.log(status.get("descricao"));
  });

  failures.forEach(function(failure) {
    console.log(failure.error);
  });
});
```

If installed globally using the npm `-g` flag, SRO can also be invoked from the command-line:

    $ sro SS123456789BR

Run `$ sro --help` for more information.

## Features

- Validates tracking numbers and their check digits
- Makes multiple API requests in batch if possible
- Strips empty or whitespace-only fields
- Creates proper `Date` objects from item events
- Handles crazy server responses, like unclosed XML tags
- Provides command-line utility with human-readable output

## Documentation

### Methods

#### track(numbers [, options], callback)

Tracks a collection of tracking numbers.

**Arguments**

- `numbers` (String|Array) - Tracking number or array of tracking numbers to be tracked.
- `options` (Object) - Optional tracking options:
  - `checkDigit` (Boolean) - Whether to validate the tracking number check digit
  -  `onProgress(progress, item)` (Function) - Callback function called for each number once its data has been retrieved. `progress` is a float number between 0 and 1. `item` is the [Item](#item) object. Invalid tracking numbers are filtered before any requests are made, so they will not be passed here.
- `callback(err, items, failures)` (Function) - Callback function called once all tracking numbers have been processed, or when an error occurs. `items` is an array of [Item](#item) objects. `failures` is an array of objects containing the tracking numbers that did not pass validation.

#### validate(number [, options], callback)

Validates a collection of tracking numbers.

**Arguments**

- `numbers` (String|Array) - Tracking number or array of tracking numbers to be validated
- `options` (Object) - Optional tracking options:
  - `checkDigit` (Boolean) - Whether to validate the tracking number check digit
- `callback(err, passes, failures)` (Function) - Callback function called once all numbers have been processed, or when an error occurs. `passes` is an array of objects containing the tracking numbers that passed validation. `failures` is an array of objects containing the tracking numbers that did not pass validation.

**Return**
True if all tracking numbers are valid, false otherwise.

### Models

SRO models are heavily inspired by [Backbone.Model](http://backbonejs.org/#Model) and provide conversions, validations, computed properties, and data access control. All models have the following base methods:

- `set(name, attr)` - Sets an attribute on the model.
- `unset(name)` - Removes an attribute from the model.
- `get(name)` - Gets the current value of an attribute from the model.
- `has(name)` - Returns true if the attribute is set to a non-null or non-undefined value.
- `forEach(iteratee)` - Iterates over the attributes, yielding each in turn to an iteratee function.
- `compact()` - Removes all attributes with empty or whitespace-only values.
- `toJSON()` - Returns a shallow copy of the model's attributes for JSON stringification.

#### Item

Represents a postal item, holding all the tracking data retrieved from the API for a given tracking number.

- `number()` - Returns the tracking number.
- `serviceCode()` - Returns the two-digit postal service code.
- `service()` - Returns the [postal service description](http://www.correios.com.br/para-voce/precisa-de-ajuda/como-rastrear-um-objeto/siglas-utilizadas-no-rastreamento-de-objeto).
- `countryCode()` - Returns the two-digit [ISO 3166-1 alpha 2](http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) country code.
- `countryName()` - Returns the country name.
- `country()` - Returns the country data from [country-data](https://github.com/OpenBookPrices/country-data).
- `events()` - Returns an array with all [Event](#event) objects, ordered by most recent.
- `status()` - Returns the most recent [Event](#event) object.
- `found()` - Returns true if there is any [Event](#event) object.

#### Event

Represents the status of an item at an specific point in time.

- `date()` - Return a `Date` object derived from the `data` and `hora` attributes.

## TODO

- Write tests with mocked responses
- Add last event-only tracking option
- Add validation-only CLI option
- Support custom user credentials
