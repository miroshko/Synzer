var SineModulator = require('../js/SineModulator');

describe('Sine Modulator', function() {
  var sineModulator;
  var modulatedObj;
  var prevVal;
  
  beforeEach(function() {
    modulatedObj = {
      param1: 100
    };

    sineModulator = new SineModulator({
      depth: 0.5,
      frequency: 1
    });

    prevVal = modulatedObj.param1;

    sineModulator.modulate(modulatedObj, 'param1');
    jasmine.clock().install();
    jasmine.clock().mockDate();
    sineModulator.start();
  });

  afterEach(function() {
    jasmine.clock().uninstall();
  });

  it('starts modulating', function() {
    jasmine.clock().tick(250);
    expect(modulatedObj.param1).toBeCloseTo(prevVal + 0.5);
    jasmine.clock().tick(250);
    expect(modulatedObj.param1).toBeCloseTo(prevVal);
    jasmine.clock().tick(250);
    expect(modulatedObj.param1).toBeCloseTo(prevVal - 0.5);
    jasmine.clock().tick(250);
    expect(modulatedObj.param1).toBeCloseTo(prevVal);
  });

  it('depth can be changed in runtime', function() {
    jasmine.clock().tick(250);
    expect(modulatedObj.param1).toBeCloseTo(prevVal + 0.5);
    jasmine.clock().tick(250);
    sineModulator.depth = 0.8;
    jasmine.clock().tick(250);
    expect(modulatedObj.param1).toBeCloseTo(prevVal - 0.8);
  });

  it('frequency can be changed in runtime', function() {
    jasmine.clock().tick(250);
    expect(modulatedObj.param1).toBeCloseTo(prevVal + 0.5);
    jasmine.clock().tick(250);
    sineModulator.frequency = 2;
    jasmine.clock().tick(125);
    expect(modulatedObj.param1).toBeCloseTo(prevVal - 0.5);
    jasmine.clock().tick(125);
    expect(modulatedObj.param1).toBeCloseTo(prevVal);
  });

  it('doesn\'t block the param from being changed by something else', function() {
    jasmine.clock().tick(500);
    modulatedObj.param1 += 50;
    jasmine.clock().tick(250);
    expect(modulatedObj.param1).toBeCloseTo(prevVal + 50 - 0.5);
  });
});