import { test } from 'tap'
import * as sro from '../index.js'

test('refuse null and undefined tracking numbers', t => {
  const numbers = [null, undefined]
  t.plan(3)
  const [passes, failures] = sro.validate(numbers)
  t.equal(passes.length, 0)
  failures.forEach(failure =>
    t.equal(failure.error, 'Tracking number is null or undefined')
  )
  t.end()
})

test('refuse non-string tracking numbers', t => {
  const numbers = [{}, [], () => {}, new Date()]
  t.plan(5)
  const [passes, failures] = sro.validate(numbers)
  t.equal(passes.length, 0)
  failures.forEach(failure =>
    t.equal(failure.error, 'Tracking number is not a string')
  )
  t.end()
})

test('refuse empty tracking numbers', t => {
  const numbers = ['', '  ']
  t.plan(3)
  const [passes, failures] = sro.validate(numbers)
  t.equal(passes.length, 0)
  failures.forEach(failure =>
    t.equal(failure.error, 'Tracking number is empty')
  )
  t.end()
})

test('refuse tracking numbers without 13 digits', t => {
  const numbers = ['SS123456789B', 'SS123456789BRA']
  t.plan(3)
  const [passes, failures] = sro.validate(numbers)
  t.equal(passes.length, 0)
  failures.forEach(failure =>
    t.equal(failure.error, 'Tracking number does not have 13 digits')
  )
  t.end()
})

test('refuse non-standard tracking numbers', t => {
  const numbers = ['SSS12345678BR', 'SS12345678BRA']
  t.plan(3)
  const [passes, failures] = sro.validate(numbers)
  t.equal(passes.length, 0)
  failures.forEach(failure =>
    t.equal(failure.error, 'Tracking number does not match standard format')
  )
  t.end()
})

test('ignore tracking number check digits by default', t => {
  const numbers = ['SS123456785BR', 'SS123456789BR']
  t.plan(3)
  const [passes, failures] = sro.validate(numbers)
  passes.forEach(pass => t.ok(numbers.includes(pass.numero)))
  t.equal(failures.length, 0)
  t.end()
})

test('check tracking number check digits when required', t => {
  const numbers = ['SS123456785BR', 'SS123456789BR']
  t.plan(4)
  const [passes, failures] = sro.validate(numbers, { checkDigit: true })
  t.equal(passes.length, 1)
  t.equal(passes[0].numero, numbers[0])
  t.equal(failures.length, 1)
  t.equal(failures[0].numero, numbers[1])
  t.end()
})
