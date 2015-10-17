var sro     = require("../"),
    chai    = require("chai"),
    fs      = require("fs"),
    iconv   = require("iconv-lite"),
    request = require("request"),
    sinon   = require("sinon"),
    expect  = chai.expect;

chai.use(require("chai-things"));

function stubRequest(type, callback) {
  var file = __dirname + "/data/" + type + ".xml";

  fs.readFile(file, function(err, data) {
    if (err) callback(err);

    var stub = sinon.stub(request, "post").yields(null, null, data);
    if (callback) callback(null, stub);
  });
}

function restoreRequest() {
  request.post.restore();
}

describe("Validation", function() {
  it("should refuse null and undefined tracking numbers", function(done) {
    sro.validate([null, void 0], function(err, passes, failures) {
      expect(err).to.not.exist;
      expect(passes).to.be.empty;
      expect(failures).to.have.length(2);
      expect(failures).to.all.have.property("error", "Tracking number is null or undefined");
      done();
    });
  });

  it("should refuse non-string tracking numbers", function(done) {
    sro.validate([{}, [], function() {}, new Date()], function(err, passes, failures) {
      expect(err).to.not.exist;
      expect(passes).to.be.empty;
      expect(failures).to.have.length(4);
      expect(failures).to.all.have.property("error", "Tracking number is not a string");
      done();
    });
  });

  it("should refuse empty tracking numbers", function(done) {
    sro.validate(["", "  "], function(err, passes, failures) {
      expect(err).to.not.exist;
      expect(passes).to.be.empty;
      expect(failures).to.have.length(2);
      expect(failures).to.all.have.property("error", "Tracking number is empty");
      done();
    });
  });

  it("should refuse tracking numbers without 13 digits", function(done) {
    sro.validate(["SS123456789B", "SS123456789BRA"], function(err, passes, failures) {
      expect(err).to.not.exist;
      expect(passes).to.be.empty;
      expect(failures).to.have.length(2);
      expect(failures).to.all.have.property("error", "Tracking number does not have 13 digits");
      done();
    });
  });

  it("should refuse non-standard tracking numbers", function(done) {
    sro.validate(["SSS12345678BR", "SS12345678BRA"], function(err, passes, failures) {
      expect(err).to.not.exist;
      expect(passes).to.be.empty;
      expect(failures).to.have.length(2);
      expect(failures).to.all.have.property("error", "Tracking number does not match standard format");
      done();
    });
  });

  it("should ignore tracking number check digits by default", function(done) {
    sro.validate(["SS123456785BR", "SS123456789BR"], function(err, passes, failures) {
      expect(err).to.not.exist;
      expect(passes).to.have.length(2);
      done();
    });
  });

  it("should check tracking number check digits when required", function(done) {
    sro.validate(["SS123456785BR", "SS123456789BR"], {checkDigit: true}, function(err, passes, failures) {
      expect(err).to.not.exist;
      expect(passes).to.have.length(1);
      expect(failures).to.have.length(1);
      expect(failures).to.all.have.property("error", "Tracking number check digit does not match");
      done();
    });
  });
});

describe("Tracking", function() {
  describe("found", function() {
    beforeEach(stubRequest.bind(null, "found"));
    afterEach(restoreRequest);

    it("should filter out invalid tracking numbers", function(done) {
      sro.track(["SSS12345678BR", "SS123456789BR", "SS12345678BRA"], function(err, items, failures) {
        expect(err).to.not.exist;
        expect(items).to.have.length(1);
        expect(failures).to.have.length(2);
        done();
      });
    });

    it("should normalize tracking numbers", function(done) {
      sro.track(" ss123456789br  ", function(err, items, failures) {
        expect(err).to.not.exist;
        expect(items).to.have.length(1);
        expect(items[0].number()).to.equal("SS123456789BR");
        expect(failures).to.be.empty;
        done();
      });
    });

    it("should ignore duplicate tracking numbers", function(done) {
      sro.track("SS123456789BR", "SS123456789BR", function(err, items, failures) {
        expect(err).to.not.exist;
        expect(items).to.have.length(1);
        expect(failures).to.be.empty;
        done();
      });
    });

    it("should make multiple API requests in batch", function(done) {
      sro.track(["SS123456789BR", "SS223456789BR", "SS323456789BR", "SS423456789BR"], function(err, items, failures) {
        expect(err).to.not.exist;
        expect(items).to.have.length(4);
        expect(failures).to.be.empty;
        expect(request.post).to.have.property("callCount", 2);
        done();
      });
    });

    it("should allow progress reporting", function(done) {
      var onProgress = sinon.spy(function(progress, item) {
        expect(progress).to.be.within(0, 1);
        expect(item).to.exist;
      });

      sro.track(["SS123456789BR", "SS223456789BR", "SS323456789BR"], {onProgress: onProgress}, function(err, items, failures) {
        expect(onProgress).to.have.property("callCount", 3);
        done();
      });
    });
  });

  describe("not found", function() {
    beforeEach(stubRequest.bind(null, "not-found"));
    afterEach(restoreRequest);

    it("should handle an item not found", function(done) {
      sro.track("SS123456789BR", function(err, items, failures) {
        expect(err).to.not.exist;
        expect(items).to.have.length(1);
        expect(failures).to.be.empty;
        done();
      });
    });
  });
});

describe("Models", function() {
  var number = "SS123456789BR",
      item   = null;

  before(function(done) {
    stubRequest("found", function(err, stub) {
      if (err) done(err);

      sro.track(number, function(err, items, failures) {
        restoreRequest();
        item = items[0];
        done();
      });
    });
  });

  describe("Item", function() {
    it("should have a number", function() {
      expect(item.number()).to.equal(number);
    });

    it("should have a service code", function() {
      expect(item.serviceCode()).to.equal("SS");
    });

    it("should have a service", function() {
      expect(item.service()).to.equal("SEDEX FÍSICO");
    });

    it("should have a country code", function() {
      expect(item.countryCode()).to.equal("BR");
    });

    it("should have a country name", function() {
      expect(item.countryName()).to.equal("Brazil");
    });

    it("should have a country", function() {
      expect(item.country()).to.exist;
    });

    it("should have events", function() {
      expect(item.events()).to.have.length(4);
    });

    it("should have a status", function() {
      expect(item.status()).to.exist;
    });

    it("should be found", function() {
      expect(item.found()).to.be.true;
    });
  });

  describe("Event", function() {
    var event = null;

    before(function() {
      event = item.status();
    });

    it("should have a date", function() {
      expect(event).to.exist;
      expect(event.date()).to.be.a("date");
    });
  });
});
