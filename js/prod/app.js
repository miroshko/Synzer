(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Note = require('./Note');

function Keyboard(el) {
  this.el = el;
  this._events = {};
}

Keyboard.prototype.pitchToNote = function(pitch) {
  // 21 == A0
  pitch = parseInt(pitch);
  if (isNaN(pitch) || pitch < 21 || pitch > 108)
    throw new Error(pitch + ' is an invalid pitch');

  var notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'B', 'H'];
  var letter = notes[(pitch - 21 + 9) % 12];
  var octave = Math.floor((pitch - 12) / 12);
  return {letter: letter, octave: octave};
};

Keyboard.prototype.draw = function(lowestNote, highestNote) {
  var key;
  for(var i = lowestNote; i < highestNote; i++) {
    key = document.createElement('div');
    key.dataset.pitch = i;
    key.classList.add('key');
    if (['C#', 'D#', 'F#', 'G#', 'B'].indexOf(this.pitchToNote(i).letter) > -1) {
      key.classList.add('key-black');
    }
    this.el.appendChild(key);
  }
};

Keyboard.prototype.startMouseListening = function() {
  var this_ = this;
  this.el.addEventListener('mousedown', function(e) {
    this_.emit('notePressed', new Note(e.target.dataset.pitch));
  });

  this.el.addEventListener('mouseup', function(e) {
    this_.emit('noteReleased', new Note(e.target.dataset.pitch));
  });
};

Keyboard.prototype.on = function(eventName, callback) {
  this._events[eventName] = this._events[eventName] || [];
  this._events[eventName].push(callback);
};

Keyboard.prototype.emit = function(eventName) {
  var args = Array.prototype.slice.call(arguments, 1);

  this._events[eventName].forEach(function(callback) {
    callback.apply(null, args);
  });
};

module.exports = Keyboard;

},{"./Note":2}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
function extendOptions(def, custom) {
  custom = custom || {};
  var options = {};
  for(var option in def) {
    options[option] = custom[option] || def[option];
  }
  return options;
}

function Sine(options) {
  this.options = extendOptions({
    volume: 0.5,
    frequency: 1000
  }, options);
}

Sine.prototype.toArray = function() {
  var convertingOptions = extendOptions({
    duration: 1,
    channels: 2,
    sampleRate: 8000,
    bitPerSample: 8
  });
  var data = [];
  data.sineOptions = convertingOptions;

  console.log( this.options )

  var ratio = convertingOptions.sampleRate / this.options.frequency;
  var durationSamples = convertingOptions.sampleRate * convertingOptions.duration * convertingOptions.channels;

  var i = 0;
  while (i < durationSamples) { 
    data[i++] = 128 + Math.round(this.options.volume * 127 * Math.sin(Math.PI / ratio * i)); // left speaker
    data[i++] = 128 + Math.round(this.options.volume * 127 * Math.sin(Math.PI / ratio * i)); // right speaker
  }

  return data;
};

module.exports = Sine;
},{}],4:[function(require,module,exports){
function Wave(options) {
  options = options || {};
  var defaultOptions = {
    channels: 1,
    bitsPerSample: 8,
    sampleRate: 44100
  };

  this.options = {};
  for(var opt in defaultOptions) if (defaultOptions.hasOwnProperty(opt)) {
    this.options[opt] = options[opt] || defaultOptions[opt];
  }

  Object.freeze(this.options);
}

Wave.prototype._generateHeader = function() {
  // off  size value
  // 0    4    "RIFF" = 0x52494646
  // 4    4    ChunkSize (36+SubChunk2Size)
  // 8    4    "WAVE" = 0x57415645
  // 12   4    "fmt" = 0x666d7420
  // 16   4    SubChunk1Size (16 for PCM)
  // 20   2    AudioFormat (PCM = 1)
  // 22   2    NumChannels
  // 24   4    SampleRate
  // 28   4    SampleRate*NumChannels*BitsPerSample/8
  // 32   2    NumChannels*BitsPerSample/8
  // 34   2    BitsPerSample
  // 36   4    "data" = 0x64617461
  // 40   4    data size = NumSamples*NumChannels*BitsPerSample/8

  var subChunk2Size = this.data.length * this.options.bitsPerSample * 8;
  var chunkSize     = 36 + subChunk2Size;
  var chunkId       = 0x52494646; // RIFF
  var format        = 0x57415645; // WAVE
  var subChunk1Id   = 0x666d7420; // fmt
  var subChunk1Size = 16;
  var audioFormat   = 1;
  var numChannels   = this.options.channels;
  var sampleRate    = this.options.sampleRate;
  var bitsPerSample = this.options.bitsPerSample;
  var byteRate      = sampleRate * numChannels * bitsPerSample / 8;
  var blockAlign    = numChannels * bitsPerSample / 8;
  var subChunk2Id   = 0x64617461; // data

  var header = new ArrayBuffer(44);
  var view = new DataView(header);

  view.setUint32(0, chunkId);
  view.setUint32(4, chunkSize, true);
  view.setUint32(8, format);
  view.setUint32(12, subChunk1Id);
  view.setUint32(16, subChunk1Size, true);
  view.setUint16(20, audioFormat, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  view.setUint32(36, subChunk2Id);
  view.setUint32(40, subChunk2Size, true);

  return header;
};

Wave.prototype._concatArrayBuffers = function(buffer1, buffer2) {
    var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    tmp.set(new Uint8Array(buffer1), 0);
    tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
    return tmp.buffer;
};

Wave.prototype.setData = function(data) {
  this.data = data;
  var bytesPerSample = this.options.bitsPerSample / 8;
  var dataBuffer = new ArrayBuffer(this.data.length * bytesPerSample);
  var dataView = new DataView(dataBuffer);
  // allows for 8 and 16 only which is ok
  var setIntFunc = 'setUint' + this.options.bitsPerSample;

  for(var i = 0; i < this.data.length; i++) {
    dataView[setIntFunc](i * bytesPerSample, this.data[i], true);
  }

  this._waveform = this._concatArrayBuffers(this._generateHeader(), dataBuffer);
};

Wave.prototype.getDataURI = function() {
  if (!this.data) {
    throw new Error('data is not set');
  }
  var binary = '';
  var bytes = new Uint8Array(this._waveform);
  for (var i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return 'data:audio/wav;base64,' + btoa(binary);
};

module.exports = Wave;
},{}],5:[function(require,module,exports){
var Wave = require('./Wave');
var Keyboard = require('./Keyboard');
var Sine = require('./Sine');

var keyboardEl = document.querySelector('.keyboard');
var audioPool = {};

var keyboard = new Keyboard(keyboardEl);
keyboard.draw(65, 85);
keyboard.startMouseListening();

keyboard.on('notePressed', function(note) {
  audioPool[note] = new Audio();

  var wave = new Wave({
    sampleRate: 8000,
    channels: 2,
    bitsPerSample: 8
  });

  var sine = new Sine({
    volume: 0.5,
    frequency: note.frequency
  });

  var data = sine.toArray({
    duration: 1,
    sampleRate: 8000,
    channels: 2,
    bitsPerSample: 8
  });

  wave.setData(data);
  audioPool[note].src = wave.getDataURI(); // set audio source
  audioPool[note].play();
});

keyboard.on('noteReleased', function(note) {
  console.log("RELEASED", note)
});


},{"./Keyboard":1,"./Sine":3,"./Wave":4}]},{},[5]);
