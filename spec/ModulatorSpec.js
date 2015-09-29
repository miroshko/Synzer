var Modulator = require('../js/Modulator');

fdescribe('Modulator', function() {
  var modulator, objToModulate;

  beforeEach(function() {
    oscillator = jasmine.createSpyObj('oscillator', ['setPeriodicWave', 'connect', 'start', 'stop']);
    oscillator.frequency = {};
    gainNode = jasmine.createSpyObj('gainNode', ['connect']);
    gainNode.gain = {};

    audioContext = {
      createOscillator: function() {},
      createGain: function() {},
      destination: {}
    };

    spyOn(audioContext, 'createOscillator').and.returnValue(oscillator);
    spyOn(audioContext, 'createGain').and.returnValue(gainNode);

    objToModulate = {value: 45};
    modulator = new Modulator(audioContext);
  });

  it('creates an oscillator', function() {
    expect(audioContext.createOscillator).toHaveBeenCalled();
  });
  it('creates a gain node', function() {
    expect(audioContext.createGain).toHaveBeenCalled();
  });
  it('connects the oscillator to the gain node', function() {
    expect(oscillator.connect).toHaveBeenCalledWith(gainNode);
  });
  it('connects the gain node to the modulated param', function() {
    var obj = {};
    modulator.connect(obj);
    expect(gainNode.connect).toHaveBeenCalledWith(obj);
  });
});