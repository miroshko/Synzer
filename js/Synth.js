var sawtooth = require('./waveforms/sawtooth');
var square = require('./waveforms/square');
var sine = require('./waveforms/sine');

function Synth() {
  this.oscillators = {};
  this.gainNodes = {};
  this.stereoPanners = {};
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

Synth.prototype.setVolume = function(volume) {
  this._volume = volume;
};

Synth.prototype.setPan = function(pan) {
  this._pan = pan;
};

Synth.prototype.play = function(note) {
  var oscillator = this.oscillators[note.pitch] = this.context.createOscillator();
  var gainNode = this.gainNodes[note.pitch] = this.context.createGain();
  var stereoPanner = this.stereoPanners[note.pitch] = this.context.createStereoPanner();

  oscillator.setPeriodicWave(this._waveForm || sine);
  oscillator.frequency.value = note.frequency;
  oscillator.connect(this.gainNodes[note.pitch]);
  
  gainNode.gain.value = this._volume / 100;
  gainNode.connect(stereoPanner);

  stereoPanner.pan.value = this._pan / 50;
  stereoPanner.connect(this.context.destination);
  
  oscillator.start(0);
};

Synth.prototype.stop = function(note) {
  this.oscillators[note.pitch].stop(0);
};

module.exports = Synth;