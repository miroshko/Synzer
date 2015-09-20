var Delay = require('../js/effects/Delay');

fdescribe("Delay", function() {
  var delay, delayNodes, audioContext;

  beforeEach(function() {
    audioContext = {
      createDelay: function() {},
      createGain: function() {},
      destination: {}
    };
    gainNode = jasmine.createSpyObj('gainNode', ['connect', 'disconnect']);
    gainNode.gain = {};
    delayNodes = [];
    for(var i = 0; i < 10; i++) {
      var delayNode = jasmine.createSpyObj('delayNode' + i, ['connect', 'disconnect']);
      delayNode.delayTime = {};
      delayNodes.push(delayNode);
    }

    var delayNodeCounter = 0;
    spyOn(audioContext, 'createDelay').and.callFake(function() {
      return delayNodes[delayNodeCounter++];
    });
    spyOn(audioContext, 'createGain').and.returnValue(gainNode);

    delay = new Delay(audioContext);
  });

  it('connects input node to delays on start', function() {
    delay.start();
    expect(gainNode.connect).toHaveBeenCalled();
  });

  it('disconnects input note from delays on stop', function() {
    delay.start();
    delay.stop();
    expect(gainNode.disconnect).toHaveBeenCalled();
  });

  it('changes delays on frequency change', function() {
    delay.taps = 3;
    delay.latency = 200;
    expect(delayNodes[0].delayTime.value).toEqual(200);
    expect(delayNodes[1].delayTime.value).toEqual(400);
    expect(delayNodes[2].delayTime.value).toEqual(600);
  });

  it('changes delay lines amount on taps change', function() {
    delay.taps = 3;
    expect(delayNodes[0].connect).toHaveBeenCalled();
    expect(delayNodes[1].connect).toHaveBeenCalled();
    expect(delayNodes[2].connect).toHaveBeenCalled();
    expect(delayNodes[3].connect).not.toHaveBeenCalled();
  });
});