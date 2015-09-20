var Keyboard = require('./Keyboard');
var Controls = require('./Controls');
var Synth = require('./Synth');
var SineModulator = require('./SineModulator');

var audioCtx = new global.AudioContext();
var synth = new Synth(audioCtx);
var volume = audioCtx.createGain();
var pan = audioCtx.createStereoPanner();

synth.connect(volume);
volume.connect(pan);
pan.connect(audioCtx.destination);

var tremolo = new SineModulator({
  depth: 1,
  frequency: 1
});
tremolo.modulate(volume.gain, 'value');

var controls = new Controls(document.querySelector('.controls'));

controls.on('wave-form-change', function(type) {
  synth.setWaveForm(type);
});

controls.on('volume-change', function(value) {
  volume.gain.value = value;
});

controls.on('pan-change', function(value) {
  pan.pan.value = value;
});

controls.on('tremolo-on', function(value) {
  value ? tremolo.start() : tremolo.stop();
});

controls.activate();

var keyboard = new Keyboard(document.querySelector('.keyboard'));
keyboard.draw(60, 84);
keyboard.startMouseListening();

keyboard.on('notePressed', function(note) {
  synth.play(note);
});

keyboard.on('noteReleased', function(note) {
  synth.stop(note);
});
