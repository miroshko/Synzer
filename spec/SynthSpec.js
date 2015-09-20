var proxyquire = require('proxyquire').noCallThru();
var Synth = proxyquire('../js/Synth', {
  './waveforms/sine': {periodicWave: true, sine: true},
  './waveforms/sawtooth': {periodicWave: true, sawtooth: true},
  './waveforms/square': {periodicWave: true, square: true}
});

describe('Synth', function() {
  var synth, gainNode, oscillator, audioContext, aNote = {pitch: 81, frequency: 440};

  beforeEach(function() {
    oscillator = jasmine.createSpyObj('oscillator', ['setPeriodicWave', 'connect', 'start', 'stop']);
    oscillator.frequency = {};
    gainNode = jasmine.createSpyObj('gainNode', ['connect']);
    gainNode.gain = {};
    stereoPanner = jasmine.createSpyObj('stereoPanner', ['connect']);
    stereoPanner.pan = {};

    audioContext = {
      createOscillator: function() {},
      createPeriodicWave: function() {},
      createStereoPanner: function() {},
      createGain: function() {}
    };

    spyOn(audioContext, 'createOscillator').and.returnValue(oscillator);
    spyOn(audioContext, 'createGain').and.returnValue(gainNode);
    spyOn(audioContext, 'createStereoPanner').and.returnValue(stereoPanner);

    global.AudioContext = function() { return audioContext; };

    synth = new Synth;
  });

  afterEach(function() {
    delete global.AudioContext;
  });

  it('constructs', function() {
    expect(synth).toEqual(jasmine.any(Object));
    expect(gainNode.connect).toHaveBeenCalled();
    expect(stereoPanner.connect).toHaveBeenCalled();
  });

  it('starts playing', function() {
    synth.play(aNote);
    expect(oscillator.start).toHaveBeenCalledWith(0);
    expect(oscillator.frequency.value).toEqual(aNote.frequency);
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
    synth.play(aNote);
    expect(oscillator.setPeriodicWave).toHaveBeenCalledWith(
      jasmine.objectContaining({periodicWave: true, sine: true})
    );
  });

  it('sets volume', function() {
    synth.setVolume(0.6);
    synth.play(aNote);
    expect(gainNode.gain.value).toBe(0.6);
  });

  it('sets pan', function() {
    synth.setPan(0.8);
    synth.play(aNote);
    expect(stereoPanner.pan.value).toBe(0.8);
  });
});