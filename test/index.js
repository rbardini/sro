/* eslint-env mocha */
import sro from '../'
import chai, {expect} from 'chai'
import chaiThings from 'chai-things'
import fs from 'fs'
import request from 'request'
import sinon from 'sinon'

chai.use(chaiThings)

const stubRequest = (type, callback) => {
  var file = `${__dirname}/data/${type}.xml`

  fs.readFile(file, (err, data) => {
    if (err) callback(err)

    var stub = sinon.stub(request, 'post').yields(null, null, data)
    if (callback) callback(null, stub)
  })
}

const restoreRequest = () => request.post.restore()

describe('Validation', () => {
  it('should refuse null and undefined tracking numbers', (done) => {
    sro.validate([null, void 0], (err, passes, failures) => {
      expect(err).to.not.exist
      expect(passes).to.be.empty
      expect(failures).to.have.length(2)
      expect(failures).to.all.have.property('error', 'Tracking number is null or undefined')
      done()
    })
  })

  it('should refuse non-string tracking numbers', (done) => {
    sro.validate([{}, [], () => {}, new Date()], (err, passes, failures) => {
      expect(err).to.not.exist
      expect(passes).to.be.empty
      expect(failures).to.have.length(4)
      expect(failures).to.all.have.property('error', 'Tracking number is not a string')
      done()
    })
  })

  it('should refuse empty tracking numbers', (done) => {
    sro.validate(['', '  '], (err, passes, failures) => {
      expect(err).to.not.exist
      expect(passes).to.be.empty
      expect(failures).to.have.length(2)
      expect(failures).to.all.have.property('error', 'Tracking number is empty')
      done()
    })
  })

  it('should refuse tracking numbers without 13 digits', (done) => {
    sro.validate(['SS123456789B', 'SS123456789BRA'], (err, passes, failures) => {
      expect(err).to.not.exist
      expect(passes).to.be.empty
      expect(failures).to.have.length(2)
      expect(failures).to.all.have.property('error', 'Tracking number does not have 13 digits')
      done()
    })
  })

  it('should refuse non-standard tracking numbers', (done) => {
    sro.validate(['SSS12345678BR', 'SS12345678BRA'], (err, passes, failures) => {
      expect(err).to.not.exist
      expect(passes).to.be.empty
      expect(failures).to.have.length(2)
      expect(failures).to.all.have.property('error', 'Tracking number does not match standard format')
      done()
    })
  })

  it('should ignore tracking number check digits by default', (done) => {
    sro.validate(['SS123456785BR', 'SS123456789BR'], (err, passes, failures) => {
      expect(err).to.not.exist
      expect(passes).to.have.length(2)
      done()
    })
  })

  it('should check tracking number check digits when required', (done) => {
    sro.validate(['SS123456785BR', 'SS123456789BR'], {checkDigit: true}, (err, passes, failures) => {
      expect(err).to.not.exist
      expect(passes).to.have.length(1)
      expect(failures).to.have.length(1)
      expect(failures).to.all.have.property('error', 'Tracking number check digit does not match')
      done()
    })
  })
})

describe('Tracking', () => {
  describe('found', () => {
    beforeEach(stubRequest.bind(null, 'found'))
    afterEach(restoreRequest)

    it('should filter out invalid tracking numbers', (done) => {
      sro.track(['SSS12345678BR', 'SS123456789BR', 'SS12345678BRA'], (err, items, failures) => {
        expect(err).to.not.exist
        expect(items).to.have.length(1)
        expect(failures).to.have.length(2)
        done()
      })
    })

    it('should normalize tracking numbers', (done) => {
      sro.track(' ss123456789br  ', (err, items, failures) => {
        expect(err).to.not.exist
        expect(items).to.have.length(1)
        expect(items[0].number()).to.equal('SS123456789BR')
        expect(failures).to.be.empty
        done()
      })
    })

    it('should ignore duplicate tracking numbers', (done) => {
      sro.track('SS123456789BR', 'SS123456789BR', (err, items, failures) => {
        expect(err).to.not.exist
        expect(items).to.have.length(1)
        expect(failures).to.be.empty
        done()
      })
    })

    it('should make multiple API requests in batch', (done) => {
      sro.track(['SS123456789BR', 'SS223456789BR', 'SS323456789BR', 'SS423456789BR'], (err, items, failures) => {
        expect(err).to.not.exist
        expect(items).to.have.length(4)
        expect(failures).to.be.empty
        expect(request.post).to.have.property('callCount', 2)
        done()
      })
    })

    it('should allow progress reporting', (done) => {
      var onProgress = sinon.spy((progress, item) => {
        expect(progress).to.be.within(0, 1)
        expect(item).to.exist
      })

      sro.track(['SS123456789BR', 'SS223456789BR', 'SS323456789BR'], {onProgress: onProgress}, (err, items, failures) => {
        expect(err).to.not.exist
        expect(onProgress).to.have.property('callCount', 3)
        done()
      })
    })
  })

  describe('not found', () => {
    beforeEach(stubRequest.bind(null, 'not-found'))
    afterEach(restoreRequest)

    it('should handle an item not found', (done) => {
      sro.track('SS123456789BR', (err, items, failures) => {
        expect(err).to.not.exist
        expect(items).to.have.length(1)
        expect(failures).to.be.empty
        done()
      })
    })
  })
})

describe('Models', () => {
  var number = 'SS123456789BR'
  var item = null

  before((done) => {
    stubRequest('found', (err, stub) => {
      if (err) done(err)

      sro.track(number, (err, items, failures) => {
        if (err) done(err)

        restoreRequest()
        item = items[0]
        done()
      })
    })
  })

  describe('Item', () => {
    it('should have a number', () => {
      expect(item.number()).to.equal(number)
    })

    it('should have a service code', () => {
      expect(item.serviceCode()).to.equal('SS')
    })

    it('should have a service', () => {
      expect(item.service()).to.equal('SEDEX FÍSICO')
    })

    it('should have a country code', () => {
      expect(item.countryCode()).to.equal('BR')
    })

    it('should have a country name', () => {
      expect(item.countryName()).to.equal('Brazil')
    })

    it('should have a country', () => {
      expect(item.country()).to.exist
    })

    it('should have events', () => {
      expect(item.events()).to.have.length(4)
    })

    it('should have a status', () => {
      expect(item.status()).to.exist
    })

    it('should be found', () => {
      expect(item.found()).to.be.true
    })
  })

  describe('Event', () => {
    var event = null

    before(() => {
      event = item.status()
    })

    it('should have a date', () => {
      expect(event).to.exist
      expect(event.date()).to.be.a('date')
    })
  })
})
