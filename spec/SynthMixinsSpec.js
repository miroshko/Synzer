var proxyquire = require('proxyquire').noCallThru();

var WaveForm = proxyquire('../js/synthMixins/WaveForm', {
  '../waveforms/sine': {periodicWave: true, sine: true},
  '../waveforms/sawtooth': {periodicWave: true, sawtooth: true},
  '../waveforms/square': {periodicWave: true, square: true}
});
var PitchShifter = require('../js/synthMixins/PitchShifter');
var ADSR = require('../js/synthMixins/ADSR');

describe('synthMixins', function() {
  var oscillator, audioContext, note;
  beforeEach(function() {
    oscillator = jasmine.createSpyObj('oscillator', ['setPeriodicWave', 'connect', 'disconnect', 'start', 'stop']);
    oscillator.frequency = {};
    gainNode = jasmine.createSpyObj('gainNode', ['connect']);
    gainNode.gain = {};

    audioContext = {
      createOscillator: function() {},
      createGain: function() {},
    };
    spyOn(audioContext, 'createOscillator').and.returnValue(oscillator);
    spyOn(audioContext, 'createGain').and.returnValue(gainNode);

    synth = {
      audioContext: audioContext,
      output: gainNode,
      play: function(note) {
        oscillator.frequency.value = note.frequency;
        return oscillator;
      },
      stop: function() {}
    };
    note = {pitch:44, frequency:100}
  });

  describe("WaveForm", function() {
    beforeEach(function() {
      WaveForm.call(synth);
    });

    it('play method returns oscillator', function() {
      expect(synth.play(note)).toBe(oscillator);
    });

    it('waveForm property can be set', function() {
      synth.waveForm = 'square';
      synth.play(note);
      expect(oscillator.setPeriodicWave).toHaveBeenCalledWith(
        jasmine.objectContaining({periodicWave: true, square: true})
      );
    });

    it('uses sine if no wave form is set', function() {
      synth.play(note);
      expect(oscillator.setPeriodicWave).toHaveBeenCalledWith(
        jasmine.objectContaining({periodicWave: true, sine: true})
      );
    });
  });

  describe('Pitch shift', function() {
    beforeEach(function() {
      PitchShifter.call(synth);
    });

    it('play method returns oscillator', function() {
      expect(synth.play(note)).toBe(oscillator);
    });

    it('pitchShift property can be set', function() {
      synth.pitchShift = 1;
      synth.play(note);
      expect(oscillator.frequency.value).toBeCloseTo(note.frequency * (Math.pow(2, 1/1200)));

      synth.pitchShift = 10;
      expect(oscillator.frequency.value).toBeCloseTo(note.frequency * (Math.pow(2, 10/1200)));

      synth.pitchShift = 1200;
      expect(oscillator.frequency.value).toBeCloseTo(note.frequency * 2);

      synth.pitchShift = -1200;
      expect(oscillator.frequency.value).toBeCloseTo(note.frequency / 2);
    });
  });

  fdescribe('ADSR', function (argument) {
    beforeEach(function() {
      ADSR.call(synth);
      synth.ADSR.A = 100;
      synth.ADSR.D = 100;
      synth.ADSR.S = 0.5;
      synth.ADSR.R = 100;
      jasmine.clock().install();
      jasmine.clock().mockDate();
    });

    afterEach(function() {
      jasmine.clock().uninstall();
    })

    it('play method returns an oscillator', function() {
      expect(synth.play(note)).toBe(oscillator);
    });

    it('wires in a gain node between oscillator and output', function() {
      synth.play(note);
      expect(gainNode.connect).toHaveBeenCalledWith(gainNode);
      expect(oscillator.disconnect).toHaveBeenCalledWith(gainNode);
      expect(oscillator.connect).toHaveBeenCalledWith(gainNode);
    });

    it('A (Attack) property sets the duration of the A linear gain phase', function() {
      synth.ADSR.A = 500;
      synth.play(note);
      expect(gainNode.gain.value).toBe(0);
      jasmine.clock().tick(250);
      expect(gainNode.gain.value).toBe(0.5);
      jasmine.clock().tick(250)
      expect(gainNode.gain.value).toBe(1);
    });

    it('D (Attack) property can be set', function() {

    });

    it('S (Attack) property can be set', function() {

    });

    it('R (Attack) property can be set', function() {

    });
  })
});

