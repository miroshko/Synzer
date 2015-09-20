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

var tremolo = new SineModulator();
tremolo.modulate(volume.gain, 'value');

var vibrato = new SineModulator();
vibrato.modulate(synth, 'pitchShift');

var controls = new Controls(document.querySelector('.controls'));

controls.on('wave-form-change', function(type) {
  synth.setWaveForm(type);
});

controls.on('volume-change', function(value) {
  console.log("VOLUME IS NOW " + value)
  volume.gain.value = value;
});

controls.on('pan-change', function(value) {
  pan.pan.value = value;
});

controls.on('tremolo-on-change', function(value) {
  parseInt(value) ? tremolo.start() : tremolo.stop();
});

controls.on('tremolo-depth-change', function(value) {
  // 1 dB = 125,89%
  tremolo.depth = Math.pow(1.2589, value);
});

controls.on('tremolo-freq-change', function(value) {
  tremolo.frequency = value;
});

setInterval(function() {
  console.log( synth.pitchShift );
}, 250);

controls.on('vibrato-on-change', function(value) {
  console.log("vibrato-on ", value)
  parseInt(value) ? vibrato.start() : vibrato.stop();
});

controls.on('vibrato-depth-change', function(value) {
  console.log("vibrato-depth ", value)
  vibrato.depth = value;
});

controls.on('vibrato-freq-change', function(value) {
  console.log("vibrato-freq ", value)
  vibrato.frequency = value;
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
