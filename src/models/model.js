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
    return Object.entries(this._attributes)
      .forEach(([key, value]) => iteratee(value, key, this._attributes))
  }

  compact () {
    this.forEach((value, name) => {
      if (typeof value === 'string' && value.trim() === '') {
        this.unset(name)
      }
    })
  }

  toJSON () {
    return JSON.parse(JSON.stringify(this._attributes))
  }
}

export default Model
