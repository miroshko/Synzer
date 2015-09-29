function Modulator(audioContext) {
  this._audioCtx = audioContext;
  this.oscillator = audioContext.createOscillator();
  this.gain = audioContext.createGain();

  this.oscillator.connect(this.gain);

  this.connect = function(obj) {
    this.gain.connect(obj);
  }
}

module.exports = Modulator;
