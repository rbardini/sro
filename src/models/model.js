import _ from 'lodash'

class Model {
  constructor (attributes = {}) {
    this._attributes = attributes
  }

  set (name, attr) {
    return (this._attributes[name] = attr)
  }

  unset (name) {
    return delete this._attributes[name]
  }

  get (attr) {
    return this._attributes[attr]
  }

  has (attr) {
    return this.get(attr) != null
  }

  forEach (iteratee) {
    return _.forEach(this._attributes, iteratee)
  }

  compact () {
    this.forEach((value, name) => {
      if (_.isString(value) && _.isEmpty(value.trim())) {
        this.unset(name)
      }
    })
  }

  toJSON () {
    return _.clone(this._attributes)
  }
}

export default Model
