var Wave = require('../js/Wave');
global.btoa = require('btoa');
global.atob = require('atob');

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

    it('getDataURI returns a non-empty string', function() {
      expect(wave.getDataURI()).toEqual(jasmine.any(String));
      expect(wave.getDataURI()).not.toEqual("");
      console.log( wave.getDataURI() )
    });
  });

  describe('Wave format has correct header value for', function() {
    var wave, bin, view;
    beforeEach(function() {
      wave = new Wave();
      bin = atob(wave.getDataURI());
      len = bin.length;
      var bytes = new Uint8Array(len);
      for (var i = 0; i < len; i++)        {
          bytes[i] = bin.charCodeAt(i);
      }
      view = new DataView(bytes.buffer);
    });

    var ch = function(pos) {
      return String.fromCharCode(view.getUint8(pos))  
    };

    it('RIFF WAVE', function() {
      expect(ch(0) + ch(1) + ch(2) + ch(3)).toBe('RIFF');
      expect(ch(8) + ch(9) + ch(10) + ch(11)).toBe('WAVE');
    });

    it('chunkSize', function() {

    });

    it('fmt', function() {
      expect(ch(12) + ch(13) + ch(14)).toBe('fmt');
    });

    it('AudioFormat', function() {

    });
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