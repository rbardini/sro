import _ from 'lodash'

import Model from './model'

class Event extends Model {
  constructor (...args) {
    super(...args)

    this._normalize()
    this._date = this._createDate()

    this.compact()
  }

  date () {
    return this._date
  }

  _normalize () {
    var descricao = this.get('descricao')

    if (_.isPlainObject(descricao)) {
      // The 'descricao' field sometimes contains unclosed tags,
      // so replace it by its character content
      this.set('descricao', descricao._ || '')
    }
  }

  _createDate () {
    var data = this.get('data').split('/')
    var hora = this.get('hora').split(':')

    var [day, month, year] = data
    var [hour, minute] = hora

    return new Date(year, month - 1, day, hour, minute)
  }
}

export default Event
