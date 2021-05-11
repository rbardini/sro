import { test } from 'tap'
import sro from '../'
import { stubRequest, restoreRequest } from './fixtures/'

const number = 'TE123456789BR'
let item = null

test('setup', (t) => {
  stubRequest('found', (err, stub) => {
    if (err) return t.bailout(err)

    sro.track(number, (err, items, failures) => {
      restoreRequest()

      if (err) return t.bailout(err)
      item = items[0]
      t.end()
    })
  })
})

test('Item', (t) => {
  t.test('have a number', (t) => {
    t.equal(item.number(), number)
    t.end()
  })

  t.test('have a service code', (t) => {
    t.equal(item.serviceCode(), 'TE')
    t.end()
  })

  t.test('have a service', (t) => {
    t.equal(item.service(), 'TESTE (OBJETO PARA TREINAMENTO)')
    t.end()
  })

  t.test('have a country code', (t) => {
    t.equal(item.countryCode(), 'BR')
    t.end()
  })

  t.test('have a country name', (t) => {
    t.equal(item.countryName(), 'Brazil')
    t.end()
  })

  t.test('have a country', (t) => {
    t.ok(item.country())
    t.end()
  })

  t.test('have events', (t) => {
    t.equal(item.events().length, 31)
    t.end()
  })

  t.test('have a status', (t) => {
    t.ok(item.status())
    t.end()
  })

  t.test('be found', (t) => {
    t.equal(item.found(), true)
    t.end()
  })

  t.end()
})

test('Event', (t) => {
  let event = null

  t.test('setup', (t) => {
    event = item.status()
    t.end()
  })

  t.test('have a date', (t) => {
    t.ok(event)
    t.ok(event.date() instanceof Date)
    t.end()
  })

  t.end()
})
