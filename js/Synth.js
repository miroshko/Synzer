var WaveForm = require('./synthMixins/WaveForm')
var PitchShifter = require('./synthMixins/PitchShifter')
var ADSR = require('./synthMixins/ADSR')

function Synth(context) {
  this.audioContext = context;
  this.output = context.createGain();
  
  this._oscillators = {};

  WaveForm.apply(this, arguments);
  PitchShifter.apply(this, arguments);
  ADSR.apply(this, arguments);
}

Synth.prototype.play = function(note) {
  var oscillator;

  oscillator = this._oscillators[note.pitch] = this.audioContext.createOscillator();
  oscillator.frequency.value = note.frequency;
  oscillator.connect(this.output);
  oscillator.start(0);
  return oscillator;
};

Synth.prototype.stop = function(note) {
  this._oscillators[note.pitch].stop(0);
};

Synth.prototype.connect = function(output) {
  this.output.connect(output);
};

module.exports = Synth;