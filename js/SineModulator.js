function SineModulator (options) {
  options = options || {};
  this._frequency = options.frequency || 0;
  this._phaseOffset = 0;
  this._startedAt = 0;
  this._interval = null;
  this._prevValue = 0;
  this.depth = options.depth || 0;

  Object.defineProperty(this, "frequency", { 
    set: function (frequency) {
      // the offset is needed in order to have seamless
      // transition between different frequencies
      frequency = parseFloat(frequency);
      this._phaseOffset = this._phaseNow();
      this._startedAt = Date.now();
      this._frequency = frequency;
    },
    get: function() {
      return this._frequency;
    }
  });
}

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
  }, 10);
};

SineModulator.prototype._phaseNow = function() {
  var timeDiff = (Date.now() - this._startedAt) / 1000;
  var phase = this._phaseOffset + timeDiff * this.frequency % 1;
  return phase;
};

SineModulator.prototype._modValueNow = function() {
  var phase = this._phaseNow();
  return Math.sin((phase) * 2 * Math.PI) * this.depth;
};

SineModulator.prototype.stop = function() {
  clearInterval(this._interval);
}

module.exports = SineModulator;
