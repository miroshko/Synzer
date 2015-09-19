var proxyquire = require('proxyquire').noCallThru();
var Synth = proxyquire('../js/Synth', {
  './waveforms/sine': {periodicWave: true, sine: true},
  './waveforms/sawtooth': {periodicWave: true, sawtooth: true},
  './waveforms/square': {periodicWave: true, square: true}
});

describe('Synth', function() {
  var synth, oscillator, audioContext, aNote = {pitch: 81, frequency: 440};

  beforeEach(function() {
    oscillator = jasmine.createSpyObj('oscillator', ['setPeriodicWave', 'connect', 'start', 'stop']);
    oscillator.frequency = {};

    audioContext = {};
    audioContext.createOscillator = function() {};
    audioContext.createPeriodicWave = function() {};
    spyOn(audioContext, 'createOscillator').and.returnValue(oscillator);
    spyOn(audioContext, 'createPeriodicWave').and.returnValue({periodicWave: true});

    global.AudioContext = function() { return audioContext; };

    synth = new Synth;
  });

  afterEach(function() {
    delete global.AudioContext;
  });

  it('starts playing', function() {
    synth.play(aNote);
    expect(oscillator.start).toHaveBeenCalledWith(0);
  });

  it('stops playing', function() {
    synth.play(aNote);
    synth.stop(aNote);
    expect(oscillator.stop).toHaveBeenCalledWith(0);
  });

  it('sets wave form', function() {
    synth.setWaveForm('square');
    synth.play(aNote);
    expect(oscillator.setPeriodicWave).toHaveBeenCalledWith(
      jasmine.objectContaining({periodicWave: true, square: true})
    );
  });

  it('uses sine if no wave form is set', function() {

  });


  it('sets volume', function() {

  });

  it('sets pan', function() {

  });
});