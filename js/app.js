var Keyboard = require('./Keyboard');
var Controls = require('./Controls');
var Synth = require('./Synth');

var keyboardEl = document.querySelector('.keyboard');
var controlsEl = document.querySelector('.controls');

var synth = new Synth();
var controls = new Controls(controlsEl);
controls.activate();
controls.on('waveFormChanged', function(type) {
  synth.setWaveForm(type);
});

var keyboard = new Keyboard(keyboardEl);
keyboard.draw(65, 85);
keyboard.startMouseListening();

keyboard.on('notePressed', function(note) {
  synth.play(note);
});

keyboard.on('noteReleased', function(note) {
  synth.stop(note);
});
