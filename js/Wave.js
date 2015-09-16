function Wave(options) {
  options = options || {};
  var defaultOptions = {
    channel: 1,
    bitrate: 44100
  };

  this.options = {};
  for(var opt in defaultOptions) if (defaultOptions.hasOwnProperty(opt)) {
    this.options[opt] = options[opt] || defaultOptions[opt];
  }
}

module.exports = Wave;