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
    channels: 1,
    sampleRate: 8000,
    bitPerSample: 8
  });
  var data = [];
  data.sineOptions = convertingOptions;

  var i = 0;

  var ratio = convertingOptions.sampleRate / this.options.frequency / 2;
  console.log(ratio)

  while (i<10000) { 
    data[i++] = 128 + Math.round(this.options.volume * 127 * Math.sin(Math.PI / ratio * i)); // left speaker
    data[i++] = 128 + Math.round(this.options.volume * 127 * Math.sin(Math.PI / ratio * i)); // right speaker
  }

  return data;
};

module.exports = Sine;