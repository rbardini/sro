import { test } from 'tap'
import * as sro from '../index.js'
import { mockRequests, restoreRequests } from './fixtures/index.js'

const number = 'TE123456789BR'
let item = null

test('Item', t => {
  t.test('setup', t => {
    mockRequests('found')

    sro.track(number, (err, items) => {
      restoreRequests()

      if (err) return t.bailout(err)
      item = items[0]
      t.end()
    })
  })

  t.test('have a number', t => {
    t.equal(item.numero, number)
    t.end()
  })

  t.test('have an acronym', t => {
    t.equal(item.sigla, 'TE')
    t.end()
  })

  t.test('have a name', t => {
    t.equal(item.nome, 'TESTE (OBJETO PARA TREINAMENTO)')
    t.end()
  })

  t.test('have a country', t => {
    t.equal(item.pais, 'BRASIL')
    t.end()
  })

  t.test('have events', t => {
    t.equal(item.eventos.length, 31)
    t.end()
  })

  t.end()
})

test('Event', t => {
  let event = null

  t.test('setup', t => {
    ;[event] = item.eventos
    t.end()
  })

  t.test('have a date', t => {
    t.equal(event.data, '2016-07-04T17:46')
    t.end()
  })

  t.test('have a description', t => {
    t.equal(event.descricao, 'Saída para entrega cancelada')
    t.end()
  })

  t.end()
})
