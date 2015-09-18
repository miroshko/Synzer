var context = new AudioContext();
var realCoeffs = new Float32Array([0,0]);
var imagCoeffs = new Float32Array([0,1]);
var wave = context.createPeriodicWave(realCoeffs, imagCoeffs);

module.exports = wave;