var proxyquire = require('proxyquire').noCallThru();

var WaveForm = proxyquire('../js/synthMixins/WaveForm', {
  '../waveforms/sine': {periodicWave: true, sine: true},
  '../waveforms/sawtooth': {periodicWave: true, sawtooth: true},
  '../waveforms/square': {periodicWave: true, square: true}
});

fdescribe("WaveForm", function() {
  var oscillator;
  beforeEach(function() {
    oscillator = jasmine.createSpyObj('oscillator', ['setPeriodicWave', 'connect', 'start', 'stop']);
    audioContext = {
      createOscillator: function() {},
    };
    spyOn(audioContext, 'createOscillator').and.returnValue(oscillator);

    synth = {
      play: function() { return oscillator; },
      stop: function() {}
    };
    WaveForm.call(synth);
  });

  it('sets wave form', function() {
    synth.waveForm = 'square';
    synth.play({pitch:44, frequency:100});
    expect(oscillator.setPeriodicWave).toHaveBeenCalledWith(
      jasmine.objectContaining({periodicWave: true, square: true})
    );
  });
});