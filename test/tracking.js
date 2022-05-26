import { test } from 'tap'
import * as sro from '../index.js'
import { mockRequests, restoreRequests } from './fixtures/index.js'

test('Found', (t) => {
  let scope

  t.beforeEach(() => (scope = mockRequests('found')))
  t.afterEach(() => restoreRequests())

  t.test('filter out invalid tracking numbers', (t) => {
    const numbers = ['TEE12345678BR', 'TE123456789BR', 'TE12345678BRA']
    t.plan(6)
    sro.track(numbers, (err, items, failures) => {
      t.error(err)
      t.equal(items.length, 1)
      t.equal(items[0].numero, numbers[1])
      t.equal(failures.length, 2)
      failures.forEach((failure) => t.not(failure.numero, numbers[1]))
      t.end()
    })
  })

  t.test('normalize tracking numbers', (t) => {
    const number = ' te123456789br  '
    t.plan(4)
    sro.track(number, (err, items, failures) => {
      t.error(err)
      t.equal(items.length, 1)
      t.equal(items[0].numero, 'TE123456789BR')
      t.equal(failures.length, 0)
      t.end()
    })
  })

  t.test('ignore duplicate tracking numbers', (t) => {
    const number = 'TE123456789BR'
    t.plan(4)
    sro.track(number, number, (err, items, failures) => {
      t.error(err)
      t.equal(items.length, 1)
      t.equal(items[0].numero, number)
      t.equal(failures.length, 0)
      t.end()
    })
  })

  t.test('make multiple API requests in batch', (t) => {
    const numbers = ['TE123456789BR', 'TE123456789BR', 'TE123456789BR', 'TE123456789BR']
    t.plan(4)
    sro.track(numbers, (err, items, failures) => {
      t.error(err)
      t.equal(items.length, 4)
      t.equal(failures.length, 0)
      t.equal(scope.isDone(), true)
      t.end()
    })
  })

  t.test('allow progress reporting', (t) => {
    const numbers = ['TE123456789BR', 'TE123456789BR', 'TE123456789BR']
    const onProgress = (progress, item) => {
      t.ok(progress >= 0 && progress <= 1)
      t.ok(numbers.includes(item.numero))
    }
    t.plan(7)
    sro.track(numbers, { onProgress }, (err, items, failures) => {
      t.error(err)
      t.end()
    })
  })

  t.end()
})

test('Not found', (t) => {
  t.beforeEach(() => mockRequests('not-found'))
  t.afterEach(() => restoreRequests())

  t.test('handle an item not found', (t) => {
    const number = 'TE123456789BR'
    t.plan(4)
    sro.track(number, (err, items, failures) => {
      t.error(err)
      t.equal(items.length, 1)
      t.equal(items[0].numero, number)
      t.equal(failures.length, 0)
      t.end()
    })
  })

  t.end()
})
