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
    });
  });

  describe('Wave format has correct header value for', function() {
    var waves, bin, views = [];
    beforeEach(function() {
      waves = [
        new Wave({channels: 1, sampleRate: 8000, bitRate: 16}),
        new Wave({channels: 2, sampleRate: 44100, bitRate: 8})
      ];
      for(var i = 0; i < waves.length; i++) {
        bin = atob(waves[i].getDataURI());
        len = bin.length;
        var bytes = new Uint8Array(len);
        for (var j = 0; j < len; j++) {
          bytes[j] = bin.charCodeAt(j);
        }
        views[i] = new DataView(bytes.buffer);
      }
    });

    var str = function(view, pos, length) {
      var str = '';
      for(var i = pos; i < pos + length; i++) {
        str += String.fromCharCode(view.getUint8(i));
      }
      return str;
    };

    it('RIFF WAVE', function() {
      expect(str(views[0], 0, 4)).toBe('RIFF');
      expect(str(views[0], 8, 4)).toBe('WAVE');
      expect(str(views[1], 0, 4)).toBe('RIFF');
      expect(str(views[1], 8, 4)).toBe('WAVE');
    });

    it('chunkSize', function() {

    });

    it('fmt', function() {
      expect(str(views[0], 12, 3)).toBe('fmt');
      expect(str(views[1], 12, 3)).toBe('fmt');
    });

    it('AudioFormat', function() {
      expect(views[0].getUint16(20, true)).toBe(1);
      expect(views[1].getUint16(20, true)).toBe(1);
    });

    it('NumChannels', function() {
      expect(views[0].getUint16(22, true)).toBe(1);
      expect(views[1].getUint16(22, true)).toBe(2);
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