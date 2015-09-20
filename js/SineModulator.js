function SineModulator (options) {
  options = options || {};
  this._frequency = options.frequency || 0;
  this._xOffset = 0;
  this._startedAt = 0;
  this._interval = null;
  this.depth = options.depth || 0;

  Object.defineProperty(this, "frequency", { 
    set: function (frequency) {
      this._xOffset = this._nowToX();
      this._frequency = frequency;
    },
    get: function() {
      return this._frequency;
    }
  });
}

SineModulator.prototype._nowToX = function(time) {
  return (Date.now() - this._startedAt) / 1000 * this.frequency * 2 * Math.PI
};

SineModulator.prototype.modulate = function(object, property) {
  this._objToModulate = object;
  this._propertyToModulate = property;
};

SineModulator.prototype.start = function() {
  var initialValue = this._objToModulate[this._propertyToModulate];
  console.log(initialValue )
  this._startedAt = Date.now();
  var this_ = this;
  this._interval = setInterval(function() {
    var ratio = this_._modRatioNow();
    this_._objToModulate[this_._propertyToModulate] = initialValue * ratio;
  }, 25);
};

SineModulator.prototype._modRatioNow = function(time) {
  // 1 dB = 125,89%
  var db = Math.sin(this._nowToX() - this._xOffset) * this.depth;
  var ratio = Math.pow(1.2589, db);
  return ratio;
};

SineModulator.prototype.stop = function() {
  clearInterval(this._interval);
}

module.exports = SineModulator;