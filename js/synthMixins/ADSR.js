function ADSR() {
  // S_duration and R_dy are always the rest
  this.ADSR = {
    A: null,
    D: null,
    S: null,
    R: null
  };

  var oscillators = {};
  var gainNodes = {};

  var old = {
    play: this.play,
    stop: this.stop
  };

  this.play = function(note) {
    var osc = oscillators[note.pitch] = old.play.call(this, note);
    var gain = gainNodes[note.pitch] = this.audioContext.createGain();
    osc.disconnect(this.output);
    osc.connect(gain);
    gain.connect(this.output);
    gain.gain.value = 0;

    var this_ = this;
    var startedAt = Date.now();
    var interval = setInterval(function() {
      var diff = Date.now() - startedAt;
      if (diff < this_.ADSR.A) {
        gain.gain.value = diff / this_.ADSR.A;
      } else if (diff < this_.ADSR.A + this_.ADSR.D) {
        gain.gain.value = 1 - (diff - this_.ADSR.A) / (this_.ADSR.D / (1 - this_.ADSR.S));
      } else {
        gain.gain.value = this_.ADSR.S;
        clearInterval(interval);
      }
    }, 10);

    return osc;
  };

  this.stop = function(note) {
    // delete oscillators[note.pitch];
    // old.stop.call(this, note);
  };
}

module.exports = ADSR;