var sawtooth = require('./waveforms/sawtooth');
var square = require('./waveforms/square');
var sine = require('./waveforms/sine');

function Synth() {
  this.oscillators = {};
  this.context = new global.AudioContext;
  this._waveForm = null;
}

Synth.prototype.setWaveForm = function(waveForm) {
  this._waveForm = {
    'sawtooth': sawtooth,
    'square': square,
    'sine': sine
  }[waveForm];
};

Synth.prototype.play = function(note) {
  oscillator = this.oscillators[note.pitch] = this.context.createOscillator();

  oscillator.setPeriodicWave(this._waveForm || sine);
  oscillator.frequency.value = note.frequency;
  oscillator.connect(this.context.destination);
  oscillator.start(0);
};

Synth.prototype.stop = function(note) {
  this.oscillators[note.pitch].stop(0);
};

module.exports = Synth;