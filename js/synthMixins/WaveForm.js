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
  }

  oscillator.setPeriodicWave(this._waveForm || sine);
}

module.exports = WaveForm;