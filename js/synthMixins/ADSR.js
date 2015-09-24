function ADSR() {
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

    this.ADSR.A = parseInt(this.ADSR.A);
    this.ADSR.D = parseInt(this.ADSR.D);
    this.ADSR.S = parseFloat(this.ADSR.S);
    this.ADSR.R = parseInt(this.ADSR.R);

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
    var releasedAt = Date.now();
    var this_ = this;
    var arguments_ = arguments;
    var gain = gainNodes[note.pitch];
    var osc = oscillators[note.pitch];
    var gainOnRelease = gain.gain.value;
    var interval = setInterval(function() {
      var diff = Date.now() - releasedAt;
      if (diff < this_.ADSR.R) {
        gain.gain.value = gainOnRelease * (1 - diff / this_.ADSR.R);
      } else {
        clearInterval(interval);
        gain.gain.value = 0;
        old.stop.apply(this_, arguments_);
        osc.disconnect(gainNodes[note.pitch]);
        gain.disconnect(this.output);
        delete oscillators[note.pitch];
        delete gain[note.pitch];
      }
    }, 10);
  };
}

module.exports = ADSR;