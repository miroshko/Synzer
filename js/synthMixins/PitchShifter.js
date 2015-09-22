function PitchShifter() {
  this.pitchShift = 0;

  var oscillators = {};

  Object.defineProperty(this, "pitchShift", { 
    set: function (ps) {
      this._pitchShift = ps;
      for(var pitch in this._oscillators) {
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
    oscillators[note.pitch] = old.play.call(this, note);
    oscillators[note.pitch].baseFrequency = oscillators[note.pitch].frequency.value;
    oscillators[note.pitch].frequency.value *= Math.pow(2, this._pitchShift/1200)
  };

  this.stop = function(note) {
    delete oscillators[note.pitch];
    old.stop.call(this, note);
  };

}

module.exports = PitchShifter;