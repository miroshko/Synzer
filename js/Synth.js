var sawtooth = require('./waveforms/sawtooth');
var square = require('./waveforms/square');
var sine = require('./waveforms/sine');

function Synth() {
  this.context = new global.AudioContext;

  this.oscillators = {};

  this.stereoPanner = this.context.createStereoPanner();
  this.stereoPanner.pan.value = this._pan;
  this.stereoPanner.connect(this.context.destination);

  this.gain = this.context.createGain();
  this.gain.value = this._volume;
  this.gain.connect(this.stereoPanner);
 
  this._waveForm = null;
}

// defaults
Synth.prototype._pan = 0;
Synth.prototype._volume = 0.5;

Synth.prototype.setWaveForm = function(waveForm) {
  this._waveForm = {
    'sawtooth': sawtooth,
    'square': square,
    'sine': sine
  }[waveForm];
};

Synth.prototype.setVolume = function(volume) {
  this.volume = volume;
  this.gain.gain.value = this.volume;
};

Synth.prototype.setPan = function(pan) {
  this.pan = pan;
  this.stereoPanner.pan.value = this.pan;
};

Synth.prototype.play = function(note) {
  var oscillator;
  if (!this.oscillators[note.pitch]) {
    oscillator = this.oscillators[note.pitch] = this.context.createOscillator()
  }

  oscillator.setPeriodicWave(this._waveForm || sine);
  oscillator.frequency.value = note.frequency;
  oscillator.connect(this.gain);
  oscillator.start(0);
};

Synth.prototype.stop = function(note) {
  this.oscillators[note.pitch].stop(0);
  delete this.oscillators[note.pitch];
};

module.exports = Synth;