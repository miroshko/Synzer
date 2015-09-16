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
  var subChunk2Size = 0                       
  var chunkId       = 0x52494646; // RIFF
  var chunkSize     = 36 + subChunk2Size                     
  var format        = 0x57415645; // WAVE
  var subChunk1Id   = 0x666d7420; // fmt
  var subChunk1Size = 16                    
  var audioFormat   = 1                     
  var numChannels   = this.options.channels                     
  var sampleRate    = this.options.sampleRate                  
  var bitsPerSample = this.options.bitsPerSample                     
  var byteRate      = sampleRate * numChannels * bitsPerSample / 8                     
  var blockAlign    = numChannels * bitsPerSample / 8                  
  var subChunk2Id   = 0x64617461; // data 

  var header = new ArrayBuffer(44);
  var view = new DataView(header)

  view.setUint32(0, chunkId)
  view.setUint32(4, chunkSize, true)
  view.setUint32(8, format)
  view.setUint32(12, subChunk1Id)
  view.setUint32(16, subChunk1Size, true)
  view.setUint16(20, audioFormat, true)
  view.setUint16(22, numChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, byteRate, true)
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, bitsPerSample, true)
  view.setUint32(36, subChunk2Id)
  view.setUint32(40, subChunk2Size)

  return header;
}

Wave.prototype._concatArrayBuffers = function(buffer1, buffer2) {
    var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    tmp.set(new Uint8Array(buffer1), 0);
    tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
    return tmp.buffer;
}

Wave.prototype.setData = function(data) {
  this.data = data;
  // this._waveform = _concatArrayBuffers(this._generateHeader(), this.data);
  this._waveform = this._generateHeader();
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