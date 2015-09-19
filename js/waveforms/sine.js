var context = new global.AudioContext();
var realCoeffs = new global.Float32Array([0,0]);
var imagCoeffs = new global.Float32Array([0,1]);
var wave = context.createPeriodicWave(realCoeffs, imagCoeffs);

module.exports = wave;