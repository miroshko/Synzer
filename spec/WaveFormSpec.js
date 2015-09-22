var proxyquire = require('proxyquire').noCallThru();
var WaveForm = proxyquire('../js/synthMixins/WaveForm', {
  '../waveforms/sine': {periodicWave: true, sine: true},
  '../waveforms/sawtooth': {periodicWave: true, sawtooth: true},
  '../waveforms/square': {periodicWave: true, square: true}
});

describe("WaveForm", function() {
  
});