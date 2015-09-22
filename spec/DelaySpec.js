var Delay = require('../js/effects/Delay');

describe("Delay", function() {
  var delay, delayNodes, audioContext;

  beforeEach(function() {
    audioContext = {
      createDelay: function() {},
      createGain: function() {},
      destination: {}
    };
    delayNodes = [];
    gainNodes = [];

    for(var i = 0; i < 10; i++) {
      var delayNode = jasmine.createSpyObj('delayNode' + i, ['connect', 'disconnect']);
      delayNode.delayTime = {};
      delayNodes.push(delayNode);

      var gainNode = jasmine.createSpyObj('gainNode' + i, ['connect', 'disconnect']);
      gainNode.gain = {};
      gainNode.i = i;
      gainNodes.push(gainNode);
    }

    var delayNodeCounter = 0;
    spyOn(audioContext, 'createDelay').and.callFake(function() {
      return delayNodes[delayNodeCounter++];
    });

    var gainNodeCounter = 0;
    spyOn(audioContext, 'createGain').and.callFake(function() {
      return gainNodes[gainNodeCounter++];
    });

    delay = new Delay(audioContext);
  });

  it('connects input node to delays on start', function() {
    delay.start();
    expect(gainNodes[0].connect).toHaveBeenCalled();
  });

  it('disconnects input note from delays on stop', function() {
    delay.start();
    delay.stop();
    expect(gainNodes[0].disconnect).toHaveBeenCalled();
  });

  it('changes delays on frequency change', function() {
    delay.taps = 3;
    delay.latency = 200;
    expect(delayNodes[0].delayTime.value).toBeCloseTo(0.2);
    expect(delayNodes[1].delayTime.value).toBeCloseTo(0.4);
    expect(delayNodes[2].delayTime.value).toBeCloseTo(0.6);
  });

  it('changes delay lines, gain nodes amount on taps change', function() {
    delay.taps = 3;
    expect(delayNodes[0].connect).toHaveBeenCalled();
    expect(delayNodes[1].connect).toHaveBeenCalled();
    expect(delayNodes[2].connect).toHaveBeenCalled();
    expect(delayNodes[3].connect).not.toHaveBeenCalled();

    expect(gainNodes[3].connect).toHaveBeenCalled();
    expect(gainNodes[4].connect).toHaveBeenCalled();
    expect(gainNodes[5].connect).toHaveBeenCalled();
    expect(gainNodes[6].connect).not.toHaveBeenCalled();

  });

  it('changes feedback', function() {
    delay.taps = 3;
    delay.feedback = 0.5;
    expect(gainNodes[3].gain.value).toBeCloseTo(0.5);
    expect(gainNodes[4].gain.value).toBeCloseTo(0.25);
    expect(gainNodes[5].gain.value).toBeCloseTo(0.125);
  });
});