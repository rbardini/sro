# SRO

[![npm package version](https://img.shields.io/npm/v/sro.svg)](https://www.npmjs.com/package/sro)
[![Build status](https://img.shields.io/github/workflow/status/rbardini/sro/Main)](https://github.com/rbardini/sro/actions)
[![Code coverage](https://img.shields.io/codecov/c/github/rbardini/sro.svg)](https://codecov.io/gh/rbardini/sro)
[![Dependencies status](https://img.shields.io/librariesio/release/npm/sro)](https://libraries.io/npm/sro)
[![JavaScript Standard Style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

📦🔍 Friendly Correios SRO API wrapper and command-line utility.

- Validate tracking numbers and their check digits
- Batch API requests whenever possible
- Strip empty or whitespace-only fields
- Create proper ISO date strings from events
- Handle crazy server responses, like unclosed XML tags
- Provide command-line utility with human-readable output

## Installation

    npm install sro

## Usage

```js
import * as sro from 'sro'

sro.track('TE123456789BR', (err, items, failures) => {
  if (err) throw err

  items.forEach(item => console.log(item.eventos[0]?.descricao))
  failures.forEach(failure => console.log(failure.error))
})
```

If installed globally using the npm `-g` flag, SRO can also be invoked from the command-line:

```console
$ sro
Usage: sro [options] <numbers...>

Options:
  -V, --version          output the version number
  -o, --output <format>  specify the output format (table|json|pretty) [table] (default: "table")
  -c, --check            check tracking number check digit (default: false)
  -h, --help             display help for command
```

## API

### `track(numbers [, options], callback)`

Tracks a collection of tracking numbers.

#### Arguments

- `numbers` (String|Array) - Tracking number or array of tracking numbers to be tracked.
- `options` (Object) - Optional tracking options:
  - `checkDigit` (Boolean) - Whether to validate the tracking number check digit
  - `onProgress(progress, item)` (Function) - Callback function called for each number once its data has been retrieved. `progress` is a float number between 0 and 1. `item` is the item object. Invalid tracking numbers are filtered before any requests are made, so they will not be passed here.
- `callback(err, items, failures)` (Function) - Callback function called once all tracking numbers have been processed, or when an error occurs. `items` is an array of item objects. `failures` is an array of objects containing the tracking numbers that did not pass validation.

### `validate(number [, options], callback)`

Validates a collection of tracking numbers.

#### Arguments

- `numbers` (String|Array) - Tracking number or array of tracking numbers to be validated
- `options` (Object) - Optional tracking options:
  - `checkDigit` (Boolean) - Whether to validate the tracking number check digit
- `callback(err, passes, failures)` (Function) - Callback function called once all numbers have been processed, or when an error occurs. `passes` is an array of objects containing the tracking numbers that passed validation. `failures` is an array of objects containing the tracking numbers that did not pass validation.

#### Return

True if all tracking numbers are valid, false otherwise.
