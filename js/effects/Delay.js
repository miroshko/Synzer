function Delay(audioCtx) {
  this._audioCtx = audioCtx;
  this.input = audioCtx.createGain();
  this._delayLines = [];
  this._gainNodes = [];
  this._delayLinesInput = audioCtx.createGain();
  this._output = audioCtx.createGain();

  this._taps = 0;
  this._latency = 0;
  this._feedback = 0;

  Object.defineProperty(this, "feedback", { 
    set: function (freq) {
      this._feedback = freq;
      this._applyParams();
    },
    get: function() {
      return this._feedback;
    }
  });

  Object.defineProperty(this, "latency", { 
    set: function (freq) {
      this._latency = freq;
      this._applyParams();
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

  this.input.connect(this._output);
}

Delay.prototype._applyParams = function() {
  for(var i = 0; i < this._delayLines.length; i++) {
    this._delayLines[i].delayTime.value = this._latency / 1000 * (i + 1);
    this._gainNodes[i].gain.value = Math.pow(this._feedback, (1 + i))
  }
};

Delay.prototype._pushTap = function() {
  var delay = this._audioCtx.createDelay(10.0);
  this._delayLines.push(delay);
  
  var gainNode = this._audioCtx.createGain();
  this._gainNodes.push(gainNode);
  
  gainNode.connect(this._output);
  delay.connect(gainNode);
  this._delayLinesInput.connect(delay);
};

Delay.prototype._popTap = function() {
  var lastDelayLine = this._delayLines.pop();
  var lastGainNode = this._gainNodes.pop();

  lastDelayLine.disconnect(lastGainNode);
  lastGainNode.disconnect(this._output);
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
