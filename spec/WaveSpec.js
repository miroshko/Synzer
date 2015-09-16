var Wave = require('../js/Wave');

describe("Wave", function() {
  describe('constructor', function() {
    var wave = null;
    beforeEach(function() {
      wave = new Wave();
    });

    it('creates an object', function() {
      expect(wave).toEqual(jasmine.any(Object));
    });

    it('has options property', function() {
      expect(wave.options).toEqual(jasmine.any(Object));
    });

    it('has 1 channel by default', function() {
      expect(wave.options.channel).toEqual(1);
      // expect(channelByte).toEqual(1);
    });

    it()
  });

  describe("writes correct headers for", function() {
    describe("number of channels", function() {
      it('one channel', function() {

      });
    });
    it("bit rate", function() {

    });
    it("sample rate", function() {

    });
    it("bits per sample", function() {

    });
  })
});