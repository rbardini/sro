var sro    = require("../"),
    chai   = require("chai"),
    expect = chai.expect;

chai.use(require("chai-things"));

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
