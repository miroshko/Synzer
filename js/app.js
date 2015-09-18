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

  var sampleRate = 8000;
  var channels = 2;
  var bitsPerSample = 8;
  var volume = 0.5;
  var duration = 1;

  var wave = new Wave({
    sampleRate: sampleRate,
    channels: channels,
    bitsPerSample: bitsPerSample
  });

  var sine = new Sine({
    volume: volume,
    frequency: note.frequency
  });

  var data = sine.toArray({
    duration: duration,
    sampleRate: sampleRate,
    channels: channels,
    bitsPerSample: bitsPerSample
  });

  wave.setData(data);
  audioPool[note].src = wave.getDataURI(); // set audio source
  audioPool[note].play();
});

keyboard.on('noteReleased', function(note) {

});

