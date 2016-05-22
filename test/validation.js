import {test} from 'tap'
import sro from '../'

test('refuse null and undefined tracking numbers', (t) => {
  var numbers = [null, void 0]
  t.plan(4)
  sro.validate(numbers, (err, passes, failures) => {
    t.error(err)
    t.equal(passes.length, 0)
    failures.forEach((failure) => t.equal(failure.error, 'Tracking number is null or undefined'))
    t.end()
  })
})

test('refuse non-string tracking numbers', (t) => {
  var numbers = [{}, [], () => {}, new Date()]
  t.plan(6)
  sro.validate(numbers, (err, passes, failures) => {
    t.error(err)
    t.equal(passes.length, 0)
    failures.forEach((failure) => t.equal(failure.error, 'Tracking number is not a string'))
    t.end()
  })
})

test('refuse empty tracking numbers', (t) => {
  var numbers = ['', '  ']
  t.plan(4)
  sro.validate(numbers, (err, passes, failures) => {
    t.error(err)
    t.equal(passes.length, 0)
    failures.forEach((failure) => t.equal(failure.error, 'Tracking number is empty'))
    t.end()
  })
})

test('refuse tracking numbers without 13 digits', (t) => {
  var numbers = ['SS123456789B', 'SS123456789BRA']
  t.plan(4)
  sro.validate(numbers, (err, passes, failures) => {
    t.error(err)
    t.equal(passes.length, 0)
    failures.forEach((failure) => t.equal(failure.error, 'Tracking number does not have 13 digits'))
    t.end()
  })
})

test('refuse non-standard tracking numbers', (t) => {
  var numbers = ['SSS12345678BR', 'SS12345678BRA']
  t.plan(4)
  sro.validate(numbers, (err, passes, failures) => {
    t.error(err)
    t.equal(passes.length, 0)
    failures.forEach((failure) => t.equal(failure.error, 'Tracking number does not match standard format'))
    t.end()
  })
})

test('ignore tracking number check digits by default', (t) => {
  var numbers = ['SS123456785BR', 'SS123456789BR']
  t.plan(4)
  sro.validate(numbers, (err, passes, failures) => {
    t.error(err)
    passes.forEach((pass) => t.ok(numbers.includes(pass.numero)))
    t.equal(failures.length, 0)
    t.end()
  })
})

test('check tracking number check digits when required', (t) => {
  var numbers = ['SS123456785BR', 'SS123456789BR']
  t.plan(5)
  sro.validate(numbers, {checkDigit: true}, (err, passes, failures) => {
    t.error(err)
    t.equal(passes.length, 1)
    t.equal(passes[0].numero, numbers[0])
    t.equal(failures.length, 1)
    t.equal(failures[0].numero, numbers[1])
    t.end()
  })
})
