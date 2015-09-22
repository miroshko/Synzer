var proxyquire = require('proxyquire').noCallThru();

var WaveForm = proxyquire('../js/synthMixins/WaveForm', {
  '../waveforms/sine': {periodicWave: true, sine: true},
  '../waveforms/sawtooth': {periodicWave: true, sawtooth: true},
  '../waveforms/square': {periodicWave: true, square: true}
});
var PitchShifter = require('../js/synthMixins/PitchShifter');



describe('synthMixins', function() {
  var oscillator, audioContext, note;
  beforeEach(function() {
    oscillator = jasmine.createSpyObj('oscillator', ['setPeriodicWave', 'connect', 'start', 'stop']);
    oscillator.frequency = {};
    audioContext = {
      createOscillator: function() {},
    };
    spyOn(audioContext, 'createOscillator').and.returnValue(oscillator);

    synth = {
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

    it('sets wave form', function() {
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

  describe('PitchShifter', function() {
    beforeEach(function() {
      PitchShifter.call(synth);
    });

    it('sets pitchshift', function() {
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
});

