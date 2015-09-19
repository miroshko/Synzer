var context = new global.AudioContext();
var approaches = 128;
var real = new global.Float32Array(approaches);
var imag = new global.Float32Array(approaches);

real[0] = 0.5;
for (var i = 1; i < approaches; i++) {
    imag[i] = 1 / (i * Math.PI);
}

var wave = context.createPeriodicWave(real, imag);

module.exports = wave;
