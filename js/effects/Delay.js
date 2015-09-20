function Delay(audioCtx) {
  this._audioCtx = audioCtx;
  this.input = audioCtx.createGain();
  this._delayLines = [];
  this._delayLinesInput = audioCtx.createGain();
  this._output = audioCtx.createGain();

  this._taps = 0;
  this._latency = 0;
  this._feedback = 0;

  Object.defineProperty(this, "latency", { 
    set: function (freq) {
      this._latency = freq;
      this._delayLines.forEach(function(delayLine, i) {
        delayLine.delayTime.value = (i + 1) * this._latency;
      }, this);
    },
    get: function() {
      return this._latency;
    }
  });

  Object.defineProperty(this, "taps", { 
    set: function (value) {
      var prevTaps = this._taps;
      var diff = value - this._taps;
      for(var i = 0; i < diff; i++) {
        diff < 0 ? this._popTap() : this._pushTap();
      }
      this._taps = value;
    },
    get: function() {
      return this._taps;
    }
  });

  this.input.connect(this._output)
}

Delay.prototype._pushTap = function() {
  var delay = this._audioCtx.createDelay();
  delay.delayTime.value = this._latency * (1 + this._delayLines.length);
  this._delayLinesInput.connect(delay);
  delay.connect(this._output);
  this._delayLines.push(delay);
};

Delay.prototype._popTap = function() {
  var lastDelayLine = this._delayLines.pop();
  lastDelayLine.disconnect(this._output);
  this._delayLinesInput.disconnect(lastDelayLine);
};

Delay.prototype.start = function() {
  if (!this._started) {
    this.input.connect(this._delayLinesInput);
    this._started = true;
  }
}

Delay.prototype.stop = function() {
  if (this._started) {
    this.input.disconnect(this._delayLinesInput);
    this._started = false;
  }
};

Delay.prototype.connect = function(target) {
  this._output.connect(target);
};

module.exports = Delay;
