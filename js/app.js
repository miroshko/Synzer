var Wave = require('./Wave');
var Keyboard = require('./Keyboard');
var Sine = require('./Sine');

var keyboardEl = document.querySelector('.keyboard');
var audioPool = {};

var keyboard = new Keyboard(keyboardEl);
keyboard.draw(36, 56);
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
    frequency: 1000
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

