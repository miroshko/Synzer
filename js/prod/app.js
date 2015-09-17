(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function Keyboard(el) {
  this.el = el;
}

Keyboard.prototype.parseNote = function() {

};

Keyboard.prototype.draw = function(lowestNote, highestNote) {
  var key;
  for(var i = lowestNote; i < highestNote; i++) {
    key = document.createElement('div');
    key.dataset.pitch = i;
    key.classList.add('key');
    this.el.appendChild(key);
  }
};

module.exports = Keyboard;

},{}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
var Wave = require('./Wave');
var Keyboard = require('./Keyboard');

var keyboardEl = document.querySelector('.keyboard');
keyboard = new Keyboard(keyboardEl);
keyboard.draw('10', '20');

keyboard.on('notePressed', function() {

});
keyboard.on('noteReleased', function() {

});
},{"./Keyboard":1,"./Wave":2}]},{},[3]);
