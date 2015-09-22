var sawtooth = require('../waveforms/sawtooth');
var square = require('../waveforms/square');
var sine = require('../waveforms/sine');

function WaveForm() {
  Object.defineProperty(this, "waveForm", { 
    set: function(waveForm) {
      this._waveForm = {
        'sawtooth': sawtooth,
        'square': square,
        'sine': sine
      }[waveForm];
    },
    get: function() {
      return this._waveForm;
    }
  });

  var old = {
    play: this.play,
    stop: this.stop
  };

  this.play = function() {
    var osc = old.play.apply(this, arguments);
    osc.setPeriodicWave(this._waveForm || sine);
    return osc;
  }

  this.stop = function() {
    old.stop.apply(this, arguments);
  }
}

module.exports = WaveForm;