var Wave = require('./Wave');
var Keyboard = require('./Keyboard');
var Sine = require('Sine');

var keyboardEl = document.querySelector('.keyboard');
var audioPool = {};

var keyboard = new Keyboard(keyboardEl);
keyboard.draw(36, 56);
keyboard.startMouseListening();

keyboard.on('notePressed', function(note) {
  audioPool[note] = new Audio();

  var wave = new Wave({
    sampleRate: 44100,
    numChannels: 1,
    bitsPerSample: 8
  });

  var i = 0, data = [];

  while (i<1000) { 
    data[i++] = 128+Math.round(127*Math.sin(i/10)); // left speaker
    data[i++] = 128+Math.round(127*Math.sin(i/200)); // right speaker
  }
  wave.setData(data);
  audioPool[note].src = wave.getDataURI(); // set audio source
  audioPool[note].play();
});

keyboard.on('noteReleased', function(note) {
  console.log("RELEASED", note)
});

