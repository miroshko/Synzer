var Keyboard = require('./Keyboard');
var Controls = require('./Controls');
var Synth = require('./Synth');

var keyboardEl = document.querySelector('.keyboard');
var controlsEl = document.querySelector('.controls');

var synth = new Synth();
var controls = new Controls(controlsEl);

controls.on('wave-form-change', function(type) {
  synth.setWaveForm(type);
});

controls.on('volume-change', function(value) {
  synth.setVolume(value);
});

controls.on('pan-change', function(value) {
  synth.setPan(value);
});

controls.activate();

var keyboard = new Keyboard(keyboardEl);
keyboard.draw(60, 84);
keyboard.startMouseListening();

keyboard.on('notePressed', function(note) {
  synth.play(note);
});

keyboard.on('noteReleased', function(note) {
  synth.stop(note);
});
