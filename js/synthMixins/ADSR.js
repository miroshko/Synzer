function ADSR() {
  this.ADSR = {
    A: null,
    D: null,
    S: null,
    R: null
  };

  var oscillators = {};
  var gainNodes = {};
  var asdIntervals = {};
  var rIntervals = {};

  var old = {
    play: this.play,
    stop: this.stop
  };

  this.play = function(note) {
    var gain = gainNodes[note.pitch];
    if (!gain) {
      gain = gainNodes[note.pitch] = this.audioContext.createGain();
      gain.connect(this.output);
      gain.gain.value = 0;
    }

    var startedAt = Date.now();
    var startedAtGain = gain.gain.value;

    if (oscillators[note.pitch]) {
      this._finalize(note);
    }

    var osc = oscillators[note.pitch] = old.play.call(this, note);
    osc.disconnect(this.output);
    osc.connect(gain);

    this.ADSR.A = parseInt(this.ADSR.A);
    this.ADSR.D = parseInt(this.ADSR.D);
    this.ADSR.S = parseFloat(this.ADSR.S);
    this.ADSR.R = parseInt(this.ADSR.R);

    asdIntervals[note.pitch] = setInterval(() => {
      var diff = Date.now() - startedAt;
      if (diff < this.ADSR.A) {
        gain.gain.value = startedAtGain + (1 - startedAtGain) * (diff / this.ADSR.A);
      } else if (diff < this.ADSR.A + this.ADSR.D) {
        gain.gain.value = 1 - (diff - this.ADSR.A) / (this.ADSR.D / (1 - this.ADSR.S));
      } else {
        gain.gain.value = this.ADSR.S;
        clearInterval(asdIntervals[note.pitch]);
      }
    }, 10);

    return osc;
  };

  this._finalize = function(note) {
    var osc = oscillators[note.pitch];
    var gain = gainNodes[note.pitch];
    clearInterval(rIntervals[note.pitch]);
    gain.gain.value = 0;
    osc.disconnect(gain);
    osc.connect(this.output);
    delete oscillators[note.pitch];
    old.stop.apply(this, arguments);
  }

  this.stop = function(note) {
    var releasedAt = Date.now();
    var this_ = this;
    var arguments_ = arguments;
    var gain = gainNodes[note.pitch];
    var gainOnRelease = gain.gain.value;
    rIntervals[note.pitch] = setInterval(() => {
      var diff = Date.now() - releasedAt;
      if (diff < this_.ADSR.R) {
        gain.gain.value = gainOnRelease * (1 - diff / this_.ADSR.R);
      } else {
        this._finalize(note);
      }
    }, 10);
  };
}

module.exports = ADSR;
