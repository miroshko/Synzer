function Wave(options) {
  options = options || {};
  var defaultOptions = {
    channels: 1,
    bits: 8,
    sampleRate: 44100
  };

  this.options = {};
  for(var opt in defaultOptions) if (defaultOptions.hasOwnProperty(opt)) {
    this.options[opt] = options[opt] || defaultOptions[opt];
  }

  var subChunk2Size = 0                       // 40   4    data size = NumSamples*NumChannels*BitsPerSample/8
  var chunkId       = [0x52,0x49,0x46,0x46]   // 0    4    "RIFF" = 0x52494646
  var chunkSize     = 36 + subChunk2Size                       // 4    4    36+SubChunk2Size = 4+(8+SubChunk1Size)+(8+SubChunk2Size)
  var format        = [0x57,0x41,0x56,0x45]   // 8    4    "WAVE" = 0x57415645
  var subChunk1Id   = [0x66,0x6d,0x74,0x20]   // 12   4    "fmt " = 0x666d7420
  var subChunk1Size = 16                      // 16   4    16 for PCM
  var audioFormat   = 1                       // 20   2    PCM = 1
  var numChannels   = options.channels                       // 22   2    Mono = 1, Stereo = 2...
  var sampleRate    = options.bitrate                    // 24   4    8000, 44100...
  var bitsPerSample = options.bits                       // 34   2    8 bits = 8, 16 bits = 16
  var byteRate      = sampleRate * numChannels * bitsPerSample / 8                       // 28   4    SampleRate*NumChannels*BitsPerSample/8
  var blockAlign    = numChannels * bitsPerSample / 8                    // 32   2    NumChannels*BitsPerSample/8
  var subChunk2Id   = [0x64,0x61,0x74,0x61]   // 36   4    "data" = 0x64617461

  var header = new ArrayBuffer(44);
  var view = new DataView(header)

  view.setUint8(0, chunkId[0])
  view.setUint8(1, chunkId[1])
  view.setUint8(2, chunkId[2])
  view.setUint8(3, chunkId[3])
  view.setUint8(4, chunkSize)
  view.setUint8(5, chunkSize)
  view.setUint8(6, chunkSize)
  view.setUint8(7, chunkSize)
  view.setUint8(8, format[0])
  view.setUint8(9, format[1])
  view.setUint8(10, format[2])
  view.setUint8(11, format[3])
  view.setUint8(12, subChunk1Id[0])
  view.setUint8(13, subChunk1Id[1])
  view.setUint8(14, subChunk1Id[2])
  view.setUint8(15, subChunk1Id[3])
  view.setUint32(16, subChunk1Size, true)
  view.setUint16(20, audioFormat, true)
  view.setUint16(22, numChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, byteRate, true)
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, bitsPerSample, true)
  view.setUint8(36, subChunk2Id[0])
  view.setUint8(37, subChunk2Id[1])
  view.setUint8(38, subChunk2Id[2])
  view.setUint8(39, subChunk2Id[3])
  view.setUint32(40, subChunk2Size)

  this._waveform = header;
}

Wave.prototype.getDataURI = function() {
  var binary = '';
  var bytes = new Uint8Array(this._waveform);
  for (var i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

module.exports = Wave;