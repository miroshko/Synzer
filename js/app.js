var Keyboard = require('./Keyboard');
var Controls = require('./Controls');

var keyboardEl = document.querySelector('.keyboard');
var controlsEl = document.querySelector('.controls');

var controls = new Controls(controlsEl);

var keyboard = new Keyboard(keyboardEl);
keyboard.draw(65, 85);
keyboard.startMouseListening();

var oscillators = {};
var context = new AudioContext;

keyboard.on('notePressed', function(note) {
  oscillator = oscillators[note.pitch] = context.createOscillator();
  oscillator.frequency.value = note.frequency;
  oscillator.connect(context.destination);
  oscillator.start(0);
});

keyboard.on('noteReleased', function(note) {
  oscillators[note.pitch].stop(0);
});

