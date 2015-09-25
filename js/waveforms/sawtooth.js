var context = new global.AudioContext();
var steps = 128;
var real = new global.Float32Array(steps);
var imag = new global.Float32Array(steps);

for (var i = 1; i < steps; i++) {
    imag[i] = 1 / (i * Math.PI);
}

var wave = context.createPeriodicWave(real, imag);

module.exports = wave;
