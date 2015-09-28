var Keyboard = require('./Keyboard');
var Controls = require('./Controls');
var Synth = require('./Synth');
var Delay = require('./effects/Delay');
var SineModulator = require('./SineModulator');

var audioCtx = new global.AudioContext();
var synth = new Synth(audioCtx);
var volume = audioCtx.createGain();
var pan = audioCtx.createStereoPanner();
var delay = new Delay(audioCtx);

synth.connect(volume);
volume.connect(delay.input);
delay.connect(pan);
pan.connect(audioCtx.destination);

var tremolo = new SineModulator();
tremolo.modulate(volume.gain, 'value');

var vibrato = new SineModulator();
vibrato.modulate(synth, 'pitchShift');

var controls = new Controls(document.querySelector('.controls'));

controls.on('wave-form-change', function(type) {
  synth.waveForm = type;
});

controls.on('volume-change', function(value) {
  volume.gain.value = value;
});

controls.on('pan-change', function(value) {
  pan.pan.value = value;
});

controls.on('tremolo-on-change', function(value) {
  parseInt(value) ? tremolo.start() : tremolo.stop();
});

controls.on('tremolo-depth-change', function(value) {
  tremolo.depth = value;
});

controls.on('tremolo-freq-change', function(value) {
  tremolo.frequency = value;
});

controls.on('vibrato-on-change', function(value) {
  parseInt(value) ? vibrato.start() : vibrato.stop();
});

controls.on('vibrato-depth-change', function(value) {
  vibrato.depth = value;
});

controls.on('vibrato-freq-change', function(value) {
  vibrato.frequency = value;
});

controls.on('delay-on-change', function(value) {
  parseInt(value) ? delay.start() : delay.stop();
});

controls.on('delay-feedback-change', function(value) {
  delay.feedback = value;
});

controls.on('delay-taps-change', function(value) {
  delay.taps = value;
});

controls.on('delay-latency-change', function(value) {
  delay.latency = value;
});

controls.on('delay-latency-change', function(value) {
  delay.latency = value;
});

controls.on('adsr-a-change', function(value) {
  synth.ADSR.A = value;
});

controls.on('adsr-d-change', function(value) {
  synth.ADSR.D = value;
});

controls.on('adsr-s-change', function(value) {
  synth.ADSR.S = value;
});

controls.on('adsr-r-change', function(value) {
  synth.ADSR.R = value;
});

controls.activate();

var keyboard = new Keyboard(document.querySelector('.keyboard'));
keyboard.draw(48, 84);
keyboard.startMouseListening();

keyboard.on('notePressed', function(note) {
  synth.play(note);
});

keyboard.on('noteReleased', function(note) {
  synth.stop(note);
});