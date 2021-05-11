import _ from 'lodash'
import { countries } from 'country-data'

import Model from './model.js'
import Event from './event.js'

import SERVICES from '../../data/services.js'

class Item extends Model {
  constructor (number, ...args) {
    super(...args)

    this._normalize(number)
    this._events = this._createEvents()
  }

  number () {
    return this.get('numero')
  }

  serviceCode () {
    return this.number().slice(0, 2)
  }

  service () {
    return SERVICES[this.serviceCode()]
  }

  countryCode () {
    return this.number().slice(-2)
  }

  countryName () {
    return (this.country() || {}).name
  }

  country () {
    return countries[this.countryCode()]
  }

  events () {
    return this._events
  }

  status () {
    return this.events()[0]
  }

  found () {
    return this.status() != null
  }

  _normalize (number) {
    _.defaults(this._attributes, { numero: number, evento: [] })
  }

  _createEvents () {
    return _
      .flatten([this.get('evento')])
      .map(event => new Event(event))
  }
}

export default Item
