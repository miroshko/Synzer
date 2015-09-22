function PitchShifter() {
  this.pitchShift = 0;

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

  Math.pow(2, this._pitchShift/1200)
}

module.exports = PitchShifter;