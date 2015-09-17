var Sine = require('../js/Sine');

describe('Sine', function() {
  var sine;

  it('with given volume', function() {
    sine = new Sine({volume: 0.25});
    var converted = sine.toArray({channels: 1, duration: 1, sampleRate: 44100, bitRate: 8});
    var maxValue = 0;
    for(var i = 0; i < converted.length; i++) {
      maxValue = Math.max(maxValue, converted[i]);
    }
    expect(maxValue).toBe(Math.round(128 + 127 * 0.25));
  });
  it('with given frequency', function() {
    sine = new Sine({volume: 1, frequency: 1000});
    var converted = sine.toArray({duration: 1, channels: 1, sampleRate: 44100, bitRate: 8});
    var zeroes = [];
    for(var i = 0; i < converted.length; i++) {
      if (converted[i] >= 128 && converted[i + 1] < 128) {
        zeroes.push(i);
      }
    }

    var avgZeroLoop = 0;
    for(var i = 1; i < zeroes.length; i++) {
      avgZeroLoop += zeroes[i] - zeroes[i-1];
    }
    avgZeroLoop /= zeroes.length - 1;

    expect(Math.round(avgZeroLoop / 2)).toEqual(Math.round(44100 / 1000));
  });
});