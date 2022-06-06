#!/usr/bin/env node
import fs from 'node:fs'
import { program } from 'commander'
import { formatters, track } from '../index.js'

const { version } = JSON.parse(
  fs.readFileSync(new URL('../package.json', import.meta.url))
)

program
  .version(version)
  .usage('[options] <numbers...>')
  .option(
    '-o, --output <format>',
    'specify the output format (table|json|pretty) [table]',
    'table'
  )
  .option('-c, --check', 'check tracking number check digit', false)
  .parse(process.argv)

const numbers = program.args
const formatter =
  formatters[program.opts().output.trim().toLowerCase()] || formatters.table
const options = {
  checkDigit: program.opts().check,
  onProgress: (progress, item) => console.log(formatter.format([item]))
}
const callback = (err, items, failures) => {
  if (err) throw err
  console.log(formatter.format(undefined, failures))
}

if (numbers.length) {
  track(numbers, options, callback)
} else {
  program.help()
}
