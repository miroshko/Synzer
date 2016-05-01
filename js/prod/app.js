(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var MediatorMixin = require('./MediatorMixin');
var template = require('../tpl/controls.html');

function Controls(el) {
  this.el = el;
  MediatorMixin.call(this);

  this.el.innerHTML = template;
}

Controls.prototype.activate = function() {
  var this_ = this;
  this.el.addEventListener('change', function(e) {
    this_.emit(e.target.name + '-change', e.target.value);
  });

  // senging out initial values
  Array.prototype.forEach.call(this.el.querySelectorAll('[name]'), function(el) {
    if (el.type == 'radio' && el.checked === false) {
      return;
    }
    this_.emit(el.name + '-change', el.value);
  });
}

module.exports = Controls;
},{"../tpl/controls.html":17,"./MediatorMixin":4}],2:[function(require,module,exports){
var Note = require('./Note');
var MediatorMixin = require('./MediatorMixin');

function Keyboard(el) {
  this.el = el;
  this._keysPressed = {};
  MediatorMixin.call(this);
}

Keyboard.prototype.draw = function(lowestNote, highestNote) {
  var key;
  this._keyEls = {};
  for(var i = lowestNote; i <= highestNote; i++) {
    this._keyEls[i] = key = document.createElement('div');
    key.dataset.pitch = i;
    key.classList.add('key');
    if (['C#', 'D#', 'F#', 'G#', 'B'].indexOf(new Note(i).letter) > -1) {
      key.classList.add('key-black');
    }
    this.el.appendChild(key);
  }
};

Keyboard.prototype.press = function(pitch) {
  var el = this._keyEls[pitch];
  el.classList.add('pressed');
  this.emit('notePressed', new Note(el.dataset.pitch));
};

Keyboard.prototype.release = function(pitch) {
  var el = this._keyEls[pitch];
  el.classList.remove('pressed');
  this.emit('noteReleased', new Note(el.dataset.pitch));
};

Keyboard.prototype.startMouseListening = function() {
  this.el.addEventListener('mousedown', (e) => {
    if (!e.target.classList.contains('key'))
      return;
    this._mouseDown = true;
    this.press(e.target.dataset.pitch);
  });

  this.el.addEventListener('mouseover', (e) => {
    if (!e.target.classList.contains('key'))
      return;
    if (this._mouseDown) {
      this.press(e.target.dataset.pitch);
    }
  });

  this.el.addEventListener('mouseleave', (e) => {
    if (!e.target.classList.contains('key'))
      return;
    this._mouseDown = false;
  });

  this.el.addEventListener('mouseout', (e) => {
    if (!e.target.classList.contains('key'))
      return;
    if (this._mouseDown) {
      this.release(e.target.dataset.pitch);
    }
  });

  this.el.addEventListener('mouseup', (e) => {
    if (!e.target.classList.contains('key'))
      return;
    if (this._mouseDown) {
      this.release(e.target.dataset.pitch);
    }
    this._mouseDown = false;
  });
};

module.exports = Keyboard;

},{"./MediatorMixin":4,"./Note":6}],3:[function(require,module,exports){
(function (global){
var MediatorMixin = require('./MediatorMixin');

const KEYCODE_TO_PITCH_MAP = {
  81: 48,
  50: 49,
  87: 50,
  51: 51,
  69: 52,
  82: 53,
  53: 54,
  84: 55,
  54: 56,
  90: 57,
  55: 58,
  85: 59,
  73: 60,
  57: 61,
  79: 62,
  48: 63,
  80: 64,
  186: 65,
  65: 66,
  89: 67,
  83: 68,
  88: 69,
  68: 70,
  67: 71,
  86: 72,
  71: 73,
  66: 74,
  72: 75,
  78: 76,
  77: 77,
  75: 78,
  188: 79,
  76: 80,
  190: 81,
  192: 82,
  189: 83
};

KeyboardListener.prototype.KEYCODE_TO_PITCH_MAP;

function KeyboardListener (options) {
  options = Object.assign({}, options);
  MediatorMixin.call(this);

  if (!options.startNote || options.startNote < 48) {
    throw new Error('startNote must be a number greater or equal than 48');
  }

  if (!options.endNote || options.endNote > 83) {
    throw new Error('endNote must be a number less or equal than 83');
  }

  this._options = options;
  this._buttonStatuses = {};

  var emitPitch = (name) => (e) => {
    var pitch = KEYCODE_TO_PITCH_MAP[e.keyCode];
    if (pitch && pitch >= this._options.startNote && pitch <= this._options.endNote && this._buttonStatuses[pitch] != name) {
      this.emit(name, pitch);
    }
    this._buttonStatuses[pitch] = name;
  }

  global.window.addEventListener('keydown', emitPitch('keyPressed'));
  global.window.addEventListener('keyup', emitPitch('keyReleased'));
}

module.exports = KeyboardListener;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./MediatorMixin":4}],4:[function(require,module,exports){
function MediatorMixin() {
  this._events = {};
  this.on = function(eventName, callback) {
    this._events[eventName] = this._events[eventName] || [];
    this._events[eventName].push(callback);
  };

  this.emit = function(eventName) {
    var args = Array.prototype.slice.call(arguments, 1);

    if (this._events[eventName]) {
      this._events[eventName].forEach(function(callback) {
        callback.apply(null, args);
      });
    }
  };
};

module.exports = MediatorMixin;
},{}],5:[function(require,module,exports){
var MediatorMixin = require('./MediatorMixin');

MidiListener.prototype._emitMidiMessage = function(event) {
  var eventName = {
    148: 'keyPressed',
    132: 'keyReleased'
  }[event.data[0]];
  this.emit(eventName, event.data[1]);
};

function MidiListener () {
  MediatorMixin.call(this);

  if (window.navigator.requestMIDIAccess) {
    window.navigator.requestMIDIAccess({sysex:false})
      .then((midiAccess) => {
        var midiInputs = midiAccess.inputs.values();
        var input = midiInputs.next();
        do {
          input.value.onmidimessage = (event) => this._emitMidiMessage(event);
          input = midiInputs.next();
        } while(!input.done)
      }, () => console.log('Failed to get access to the MIDI device'));
  } else {
    console.log('MIDI API is not available in the browser');
  }
}

module.exports = MidiListener;

},{"./MediatorMixin":4}],6:[function(require,module,exports){
function Note(letterWithOctaveOrPitch) {
  if (!this._parsePitch(letterWithOctaveOrPitch) && !this._parseLetter(letterWithOctaveOrPitch)) {
    throw new Error('Can not parse ' + letterWithOctaveOrPitch);
  }
}

Note.prototype._NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'B', 'H'];

Note.prototype._parsePitch = function(pitch) {
  // 21 == A0
  pitch = parseInt(pitch);
  if (isNaN(pitch) || pitch < 21 || pitch > 108)
    return false;
  
  this.letter = this._NOTES[(pitch - 21 + 9) % 12];
  this.octave = Math.floor((pitch - 12) / 12);
  this.pitch = pitch;
  this.frequency = this._freq(this.pitch);
  return true;
};

Note.prototype._parseLetter = function(letterOctave) {
  var match = letterOctave.match(/([ABCDEFGH]#?)(\d+)/);
  if (!match.length)
    return false;
  this.letter = match[1];
  this.octave = parseInt(match[2]);
  this.pitch = this._NOTES.indexOf(this.letter) + 12 * (this.octave + 1);
  this.frequency = this._freq(this.pitch);
  return true;
};

Note.prototype._freq = function(pitch) {
  return Math.pow(2, (pitch - 20 - 49) / 12) * 440;
};

module.exports = Note;
},{}],7:[function(require,module,exports){
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
  return this;
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

},{}],8:[function(require,module,exports){
var WaveForm = require('./synthMixins/WaveForm')
var PitchShifter = require('./synthMixins/PitchShifter')
var ADSR = require('./synthMixins/ADSR')

function Synth(context) {
  this.audioContext = context;
  this.output = context.createGain();

  this._oscillators = {};

  WaveForm.apply(this, arguments);
  PitchShifter.apply(this, arguments);
  ADSR.apply(this, arguments);
}

Synth.prototype.play = function(note) {
  var oscillator;

  oscillator = this._oscillators[note.pitch];
  if (oscillator) {
    this.stop(note);
  }

  oscillator = this._oscillators[note.pitch] = this.audioContext.createOscillator();
  oscillator.frequency.value = note.frequency;
  oscillator.connect(this.output);
  oscillator.start(0);
  return oscillator;
};

Synth.prototype.stop = function(note) {
  this._oscillators[note.pitch].disconnect(this.output);
  this._oscillators[note.pitch].stop(0);
  delete this._oscillators[note.pitch];
};

Synth.prototype.connect = function(output) {
  this.output.connect(output);
};

module.exports = Synth;

},{"./synthMixins/ADSR":11,"./synthMixins/PitchShifter":12,"./synthMixins/WaveForm":13}],9:[function(require,module,exports){
(function (global){
var ScreenKeyboard = require('./Keyboard');
var KeyboardListener = require('./KeyboardListener');
var MidiListener = require('./MidiListener');
var Controls = require('./Controls');
var Synth = require('./Synth');
var Delay = require('./effects/Delay');
var SineModulator = require('./SineModulator');

var audioCtx = new global.AudioContext();
var synth = new Synth(audioCtx);
var volume = audioCtx.createGain();
var pan = audioCtx.createStereoPanner();
var delay = new Delay(audioCtx);

synth.connect(volume);
volume.connect(delay.input);
delay.connect(pan);
pan.connect(audioCtx.destination);

var tremolo = new SineModulator().modulate(volume.gain, 'value');
var vibrato = new SineModulator().modulate(synth, 'pitchShift');
var controls = new Controls(document.querySelector('.controls'));

controls.on('wave-form-change', function(type) {
  synth.waveForm = type;
});

controls.on('volume-change', function(value) {
  volume.gain.value = value;
});

controls.on('pan-change', function(value) {
  pan.pan.value = value;
});

controls.on('tremolo-on-change', function(value) {
  parseInt(value) ? tremolo.start() : tremolo.stop();
});

controls.on('tremolo-depth-change', function(value) {
  tremolo.depth = value;
});

controls.on('tremolo-freq-change', function(value) {
  tremolo.frequency = value;
});

controls.on('vibrato-on-change', function(value) {
  parseInt(value) ? vibrato.start() : vibrato.stop();
});

controls.on('vibrato-depth-change', function(value) {
  vibrato.depth = value;
});

controls.on('vibrato-freq-change', function(value) {
  vibrato.frequency = value;
});

controls.on('delay-on-change', function(value) {
  parseInt(value) ? delay.start() : delay.stop();
});

controls.on('delay-feedback-change', function(value) {
  delay.feedback = value;
});

controls.on('delay-taps-change', function(value) {
  delay.taps = value;
});

controls.on('delay-latency-change', function(value) {
  delay.latency = value;
});

controls.on('delay-latency-change', function(value) {
  delay.latency = value;
});

controls.on('adsr-a-change', function(value) {
  synth.ADSR.A = value;
});

controls.on('adsr-d-change', function(value) {
  synth.ADSR.D = value;
});

controls.on('adsr-s-change', function(value) {
  synth.ADSR.S = value;
});

controls.on('adsr-r-change', function(value) {
  synth.ADSR.R = value;
});

controls.activate();

var screenKeyboard = new ScreenKeyboard(document.querySelector('.keyboard'));
screenKeyboard.draw(48, 83);
screenKeyboard.startMouseListening();

screenKeyboard.on('notePressed', function(note) {
  synth.play(note);
});

screenKeyboard.on('noteReleased', function(note) {
  synth.stop(note);
});

var keyboardListener = new KeyboardListener({startNote: 48, endNote: 83});
keyboardListener.on('keyPressed', (pitch) => screenKeyboard.press(pitch));
keyboardListener.on('keyReleased', (pitch) => screenKeyboard.release(pitch));

var midiListener = new MidiListener({startNote: 48, endNote: 83});
midiListener.on('keyPressed', (pitch) => screenKeyboard.press(pitch));
midiListener.on('keyReleased', (pitch) => screenKeyboard.release(pitch));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Controls":1,"./Keyboard":2,"./KeyboardListener":3,"./MidiListener":5,"./SineModulator":7,"./Synth":8,"./effects/Delay":10}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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
},{}],13:[function(require,module,exports){
var sawtooth = require('../waveforms/sawtooth');
var square = require('../waveforms/square');
var sine = require('../waveforms/sine');

function WaveForm() {
  Object.defineProperty(this, "waveForm", { 
    set: function(waveForm) {
      this._waveForm = {
        'sawtooth': sawtooth,
        'square': square,
        'sine': sine
      }[waveForm];
    },
    get: function() {
      return this._waveForm;
    }
  });

  var old = {
    play: this.play,
    stop: this.stop
  };

  this.play = function() {
    var osc = old.play.apply(this, arguments);
    osc.setPeriodicWave(this._waveForm || sine);
    return osc;
  }

  this.stop = function() {
    old.stop.apply(this, arguments);
  }
}

module.exports = WaveForm;
},{"../waveforms/sawtooth":14,"../waveforms/sine":15,"../waveforms/square":16}],14:[function(require,module,exports){
(function (global){
var context = new global.AudioContext();
var steps = 128;
var real = new global.Float32Array(steps);
var imag = new global.Float32Array(steps);

for (var i = 1; i < steps; i++) {
    imag[i] = 1 / (i * Math.PI);
}

var wave = context.createPeriodicWave(real, imag);

module.exports = wave;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],15:[function(require,module,exports){
(function (global){
var context = new global.AudioContext();
var realCoeffs = new global.Float32Array([0,0]);
var imagCoeffs = new global.Float32Array([0,1]);
var wave = context.createPeriodicWave(realCoeffs, imagCoeffs);

module.exports = wave;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],16:[function(require,module,exports){
(function (global){
var context = new global.AudioContext();
var approaches = 128;
var real = new global.Float32Array(approaches);
var imag = new global.Float32Array(approaches);

real[0] = 0;
for (var i = 1; i < approaches; i++) {
  imag[i] = i % 2 == 0 ? 0 : 4 / (i * Math.PI);
}

var wave = context.createPeriodicWave(real, imag);

module.exports = wave;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],17:[function(require,module,exports){
module.exports = "<link rel=\"stylesheet\" href=\"css/controls.css\">\n\n<div class=\"col3-container\">\n  <h3>Tremolo</h3>\n  <label>\n    <input type=\"radio\" name=\"tremolo-on\" value=\"1\"><span>ON</span>\n  </label>\n  <label>\n    <input type=\"radio\" type=\"radio\" name=\"tremolo-on\" value=\"0\" checked=\"true\"><span>OFF</span>\n  </label>\n  <label class=\"osc1-depth\">\n    <span>Depth</span>\n    <input type=\"number\" name=\"tremolo-depth\" value=\"0.2\" step=\"0.1\" max=\"1000\" min=\"0\">\n  </label>\n  <label class=\"osc1-length\">\n    <span>Freq</span>\n    <input type=\"number\" name=\"tremolo-freq\" value=\"2\">\n  </label>\n</div>\n\n<div class=\"col3-container\">\n  <h3>Vibrato</h3>\n  <label>\n    <input type=\"radio\" name=\"vibrato-on\" value=\"1\"><span>ON</span>\n  </label>\n  <label>\n    <input type=\"radio\" type=\"radio\" name=\"vibrato-on\" value=\"0\" checked=\"true\"><span>OFF</span>\n  </label>\n  <label class=\"osc1-length\">\n    <span>Cent</span>\n    <input type=\"number\" name=\"vibrato-depth\" min=\"\" step=\"10\" max=\"200\" value=\"50\">\n  </label>\n  <label class=\"osc1-depth\">\n    <span>Freq</span>\n    <input type=\"number\" name=\"vibrato-freq\" value=\"5\" max=\"20\" min=\"0\">\n  </label>\n</div>\n\n<div class=\"col3-container\">\n  <h3>Delay</h3>\n  <label>\n    <input type=\"radio\" name=\"delay-on\" value=\"1\"><span>ON</span>\n  </label>\n  <label>\n    <input type=\"radio\" type=\"radio\" name=\"delay-on\" value=\"0\" checked=\"true\"><span>OFF</span>\n  </label>\n  <label class=\"delay-taps\">\n    <span>Taps</span>\n    <input type=\"number\" name=\"delay-taps\" value=\"2\" max=\"10\" min=\"0\">\n  </label>\n  <label class=\"delay-feedback\">\n    <span>Feedback</span>\n    <input type=\"number\" name=\"delay-feedback\" value=\"0.7\" max=\"2\" min=\"0\" step=\"0.1\">\n  </label>\n  <label class=\"delay-freq\">\n    <span>Latency</span>\n    <input type=\"number\" name=\"delay-latency\" value=\"400\" step=\"10\" min=\"0\" max=\"5000\">\n  </label>\n</div>\n\n<div class=\"col5-container adsr-container\">\n  <h3>ADSR envelope</h3>\n  <div class=\"col2-container\">\n    <label class=\"ADSR-A\">\n      <span>A</span>\n      <input type=\"number\" name=\"adsr-a\" value=\"50\" max=\"1000\" step=\"10\">\n    </label><br>\n    <label class=\"ADSR-D\">\n      <span>D</span>\n      <input type=\"number\" name=\"adsr-d\" value=\"50\" min=\"0\" max=\"5000\" step=\"50\">\n    </label><br>\n    <label class=\"ADSR-S\">\n      <span>S</span>\n      <input type=\"number\" name=\"adsr-s\" value=\"0.7\" min=\"0\" max=\"1\" step=\"0.1\">\n    </label><br>\n    <label class=\"ADSR-R\">\n      <span>R</span>\n      <input type=\"number\" name=\"adsr-r\" value=\"300\" min=\"0\" max=\"5000\" step=\"100\">\n    </label><br>\n  </div>\n  <img src=\"img/adsr.png\" class=\"adsr-image\" alt=\"ADSR\">\n</div>\n\n<div class=\"volume-pan-container col3-container\">\n  <label class=\"volume\">\n    <span>Volume</span>\n    <input class=\"volume\" name=\"volume\" value=\"0.5\" min=\"0\" max=\"1\" step=\"0.1\" type=\"number\">\n  </label>\n  <label class=\"pan\">\n    <span>Pan</span>\n    <input class=\"volume\" name=\"pan\" value=\"0\" min=\"-1\" max=\"1\" step=\"0.1\" type=\"number\">\n  </label>\n</div>\n\n<div class=\"wave-form-container col6-container\">\n  <label class=\"wave-form sine\">\n    <span class=\"img\"></span><br>\n    <input type=\"radio\" name=\"wave-form\" value=\"sine\" checked>\n  </label>\n  <label class=\"wave-form sawtooth\">\n    <span class=\"img\"></span><br>\n    <input type=\"radio\" name=\"wave-form\" value=\"sawtooth\">\n  </label>\n  <label class=\"wave-form square\">\n    <span class=\"img\"></span><br>\n    <input type=\"radio\" name=\"wave-form\" value=\"square\">\n  </label>\n</div>\n";

},{}]},{},[9]);
