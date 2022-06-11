import { test } from 'tap'
import * as sro from '../index.js'
import { mockRequests, restoreRequests } from './fixtures/index.js'

const number = 'TE123456789BR'
let item = null

test('Item', t => {
  t.before(async () => {
    mockRequests('found')
    const [items] = await sro.track(number)
    item = items[0]
    restoreRequests()
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

  t.before(() => ([event] = item.eventos))

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
