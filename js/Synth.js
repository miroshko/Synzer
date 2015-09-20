var sawtooth = require('./waveforms/sawtooth');
var square = require('./waveforms/square');
var sine = require('./waveforms/sine');

function Synth(context) {
  this._oscillators = {};
  this._waveForm = null;
  this._context = context;
  this._pitchShift = 0;
  this._notes = {};

  Object.defineProperty(this, "pitchShift", { 
    set: function (ps) {
      this._pitchShift = ps;
      for(var pitch in this._oscillators) {
        this._oscillators[pitch].frequency.value =
          this._oscillators[pitch].baseFrequency * Math.pow(2, this._pitchShift/1200);
      }
    },
    get: function() {
      return this._pitchShift;
    }
  });
}

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
  oscillator.baseFrequency = note.frequency;
  oscillator.frequency.value = note.frequency * Math.pow(2, this._pitchShift/1200);
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
    this._oscillators[pitch].connect(this._output);
  }
};

module.exports = Synth;