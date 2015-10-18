import _ from 'lodash'
import {countries} from 'country-data'

import Model from './model'
import Event from './event'

import SERVICES from '../../data/services.json'

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
    _.defaults(this._attributes, {numero: number, evento: []})
  }

  _createEvents () {
    return this.get('evento').map(function (event) {
      return new Event(event)
    })
  }
}

export default Item
