var proxyquire = require('proxyquire').noCallThru();
var Synth = proxyquire('../js/Synth', {
  './synthMixins/ADSR': function() {},
  './synthMixins/PitchShifter': function() {},
  './synthMixins/WaveForm': function() {}
});

describe('Synth', function() {
  var synth, gainNode, oscillator, audioContext, aNote = {pitch: 81, frequency: 440}, aNote2 = {pitch: 93, frequency: 880};

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
      createGain: function() {},
      destination: {}
    };

    spyOn(audioContext, 'createOscillator').and.returnValue(oscillator);
    spyOn(audioContext, 'createGain').and.returnValue(gainNode);
    spyOn(audioContext, 'createStereoPanner').and.returnValue(stereoPanner);

    synth = new Synth(audioContext);
  });

  afterEach(function() {
    delete global.AudioContext;
  });

  it('constructs', function() {
    expect(synth).toEqual(jasmine.any(Object));
  });

  it('starts playing', function() {
    synth.play(aNote);
    expect(oscillator.start).toHaveBeenCalledWith(0);
    expect(oscillator.frequency.value).toEqual(aNote.frequency)
  });

  it('stops playing', function() {
    synth.play(aNote);
    synth.stop(aNote);
    expect(oscillator.stop).toHaveBeenCalledWith(0);
  });

  it('plays note several times', function() {
    synth.play(aNote);
    synth.stop(aNote);
    synth.play(aNote);
    expect(oscillator.start.calls.count()).toBe(2);
  });

  xit('uses sine if no wave form is set', function() {
    synth.play(aNote);
    expect(oscillator.setPeriodicWave).toHaveBeenCalledWith(
      jasmine.objectContaining({periodicWave: true, sine: true})
    );
  });

  xit('sets pitchshift', function() {
    synth.pitchShift = 1;
    synth.play(aNote);
    expect(oscillator.frequency.value).toBeCloseTo(440 * (Math.pow(2, 1/1200)));

    synth.pitchShift = 10;
    expect(oscillator.frequency.value).toBeCloseTo(440 * (Math.pow(2, 10/1200)));

    synth.pitchShift = 1200;
    expect(oscillator.frequency.value).toBeCloseTo(880);

    synth.pitchShift = -1200;
    expect(oscillator.frequency.value).toBeCloseTo(220);
  });

  it('connects all oscillators when connect is called', function() {
    synth.play(aNote);
    synth.play(aNote2);
    expect(oscillator.connect).toHaveBeenCalledWith(gainNode);
    expect(oscillator.connect.calls.count()).toBe(2);
  });

  xit('sets ADSR', function() {
    synth.A_duration = 40;
    synth.D_duration = 280;
    synth.S_duration = 400;
    synth.R_duration = 400;
    synth.A_dy = 1;
    synth.D_dy = -0.2;
    synth.S_dy = 0;
  });
});