SRO
===

Friendly Correios SRO API wrapper and command-line utility

## Features

- Validates tracking numbers and their check digits
- Makes multiple API requests in batch if possible
- Strips empty or whitespace-only fields
- Creates proper `Date` objects from item events
- Handles crazy server responses, like unclosed XML tags
- Provides command-line utility with human-readable output

## Installation

    $ npm install sro

## Usage

```js
var sro = require("./");

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

## Documentation

### track(numbers [, options], callback)

Tracks a collection of tracking numbers.

**Arguments**

- `numbers` (String|Array) - Tracking number or array of tracking numbers to be tracked.
- `options` (Object) - Optional tracking options:
  - `checkDigit` (Boolean) - Whether to validate the tracking number check digit
  -  `onProgress(progress, item)` (Function) - Callback function called for each number once its data has been retrieved. `progress` is a float number between 0 and 1. `item` is the Item object. Invalid tracking numbers are filtered before any requests are made, so they will not be passed here.
- `callback(err, items, failures)` (Function) - Callback function called once all tracking numbers have been processed, or when an error occurs. `items` is an array of Item objects. `failures` is an array of objects containing the tracking numbers that did not pass validation.

### validate(number [, options], callback)

Validates a collection of tracking number.

**Arguments**

- `numbers` (String|Array) - Tracking number or array of tracking numbers to be validated
- `options` (Object) - Optional tracking options:
  - `checkDigit` (Boolean) - Whether to validate the tracking number check digit
- `callback(err, passes, failures)` (Function) - Callback function called once all numbers have been processed, or when an error occurs. `passes` is an array of objects containing the tracking numbers that passed validation. `failures` is an array of objects containing the tracking numbers that did not pass validation.

**Return**
True if all tracking numbers are valid, false otherwise.

## TODO

- Write tests with mocked responses
- Add last event-only tracking option
- Add validation-only CLI option
- Support custom user credentials
