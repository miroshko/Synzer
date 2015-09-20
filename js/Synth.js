var sawtooth = require('./waveforms/sawtooth');
var square = require('./waveforms/square');
var sine = require('./waveforms/sine');

function Synth(context) {
  this._oscillators = {};
  this._waveForm = null;
  this._context = context;
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

Synth.prototype.play = function(note) {
  var oscillator;
  if (!this._oscillators[note.pitch]) {
    oscillator = this._oscillators[note.pitch] = this._context.createOscillator()
  }

  oscillator.setPeriodicWave(this._waveForm || sine);
  oscillator.frequency.value = note.frequency;
  oscillator.connect(this._output);
  oscillator.start(0);
};

Synth.prototype.stop = function(note) {
  this._oscillators[note.pitch].stop(0);
  delete this._oscillators[note.pitch];
};

Synth.prototype.connect = function(output) {
  this._output = output;
  for (var pitch in this.oscillators) {
    this.oscillators[pitch].connect(this._output);
  }
};

module.exports = Synth;