function SineModulator (options) {
  options = options || {};
  this._frequency = options.frequency || 0;
  this._xOffset = 0;
  this._startedAt = 0;
  this._interval = null;
  this._prevValue = 0;
  this.depth = options.depth || 0;

  Object.defineProperty(this, "frequency", { 
    set: function (frequency) {
      // the offset is needed in order to have seamless
      // transition between different frequencies
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
  this._startedAt = Date.now();
  var this_ = this;
  this._interval = setInterval(function() {
    var value = this_._modValueNow();
    var diff = value - this_._prevValue;
    this_._objToModulate[this_._propertyToModulate] += diff;
    this_._prevValue = value;
  }, 25);
};

SineModulator.prototype._modValueNow = function(time) {
  // 1 dB = 125,89%
  return Math.sin(this._nowToX() - this._xOffset) * this.depth;
};

SineModulator.prototype.stop = function() {
  clearInterval(this._interval);
}

module.exports = SineModulator;
