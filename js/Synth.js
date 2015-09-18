var saw = require('./waveforms/saw');
var square = require('./waveforms/square');
var sine = require('./waveforms/sine');

function Synth() {
  this.oscillators = {};
  this.context = new AudioContext;
  this._waveForm = sine;
}

Synth.prototype.setWaveForm = function(waveForm) {
  this._waveForm = {
    'saw': saw,
    'square': square,
    'sine': sine
  }[waveForm] || sine;
};

Synth.prototype.play = function(note) {
  oscillator = this.oscillators[note.pitch] = this.context.createOscillator();
  oscillator.setPeriodicWave(this._waveForm);
  oscillator.frequency.value = note.frequency;
  oscillator.connect(this.context.destination);
  oscillator.start(0);
};

Synth.prototype.stop = function(note) {
  this.oscillators[note.pitch].stop(0);
};

module.exports = Synth;