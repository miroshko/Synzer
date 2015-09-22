var sawtooth = require('./waveforms/sawtooth');
var square = require('./waveforms/square');
var sine = require('./waveforms/sine');
var PitchShifter = require('./synthMixins/PitchShifter')
var ADSR = require('./synthMixins/ADSR')

function Synth(context) {
  this._oscillators = {};
  this._context = context;
  this._notes = {};
  this._output = context.createGain();
}

Synth.prototype.play = function(note) {
  var oscillator;

  if (!this._oscillators[note.pitch]) {
    oscillator = this._oscillators[note.pitch] = this._context.createOscillator()
  }

  oscillator.frequency.value = note.frequency;
  oscillator.connect(this._output);
  oscillator.start(0);
  return oscillator;
};

Synth.prototype.stop = function(note) {
  this._oscillators[note.pitch].stop(0);
};

Synth.prototype.connect = function(output) {
  this._output.connect(output);
};

module.exports = Synth;