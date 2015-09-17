function extendOptions(def, custom) {
  custom = custom || {};
  var options = {};
  for(var option in def) {
    options[option] = options[option] || def[option];
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

  var ratio = convertingOptions.sampleRate / this.options.frequency;
  var durationSamples = convertingOptions.sampleRate * convertingOptions.duration * convertingOptions.channels;

  console.log(durationSamples);

  var i = 0;
  while (i < durationSamples) { 
    data[i++] = 128 + Math.round(this.options.volume * 127 * Math.sin(Math.PI / ratio * i)); // left speaker
    data[i++] = 128 + Math.round(this.options.volume * 127 * Math.sin(Math.PI / ratio * i)); // right speaker
  }

  return data;
};

module.exports = Sine;