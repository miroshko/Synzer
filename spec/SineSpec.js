var Sine = require('../js/Sine');

describe('Sine', function() {
  var sine;

  it('with given volume', function() {
    sine = new Sine({volume: 0.5});
    var converted = sine.toArray({duration: 1, sampleRate: 44100, bitRate: 8});
    var maxValue = 0;
    for(var i = 0; i < 200; i++) {
      maxValue = Math.max(maxValue, converted[i]);
    }
    expect(maxValue).toBe(Math.floor(127 + 127 * 0.5));
  });

  it('with given frequency', function() {
    sine = new Sine({volume: 0.2, frequency: 5000});
    var converted = sine.toArray({duration: 1, channels: 2, sampleRate: 44100, bitRate: 8});
  });
});