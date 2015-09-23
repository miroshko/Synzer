function PitchShifter() {
  this._pitchShift = 0;
  var oscillators = {};

  Object.defineProperty(this, "pitchShift", { 
    set: function (ps) {
      this._pitchShift = ps;
      for(var pitch in oscillators) {
        oscillators[pitch].frequency.value =
          oscillators[pitch].baseFrequency * Math.pow(2, this._pitchShift/1200);
      }
    },
    get: function() {
      return this._pitchShift;
    }
  });

  var old = {
    play: this.play,
    stop: this.stop
  };

  this.play = function(note) {
    var osc = oscillators[note.pitch] = old.play.call(this, note);
    osc.baseFrequency = note.frequency;
    osc.frequency.value = osc.baseFrequency * Math.pow(2, this._pitchShift/1200);
    return osc;
  };

  this.stop = function(note) {
    delete oscillators[note.pitch];
    old.stop.apply(this, arguments);
  };

}

module.exports = PitchShifter;