var KeyboardListener = require('../js/KeyboardListener');

describe('KeyboardListener', function() {
  beforeEach(function() {
    global.window = {
      addEventListener: jasmine.createSpy('window.addEventListener')
    };
  });

  afterEach(function() {
    delete global.window;
  });

  it('throws if specified notes range is out of allowed range (48 - 83)', function() {
    expect(function() {
      new KeyboardListener({startNote: 47, endNote: 81});
    }).toThrow();
    expect(function() {
      new KeyboardListener({startNote: 51, endNote: 85});
    }).toThrow();
  });

  it('does not throw when notes are within 48 - 83 range', function() {
    expect(function() {
      new KeyboardListener({startNote: 48, endNote: 83})
    }).not.toThrow();
    expect(function() {
      new KeyboardListener({startNote: 52, endNote: 63})
    }).not.toThrow();
  });

  describe('', function() {
    var keyboardListener;
    var keypressCallback;
    var keyupCallback;
    var onKeyPress;
    var onKeyRelease;

    beforeEach(function() {
      global.window.addEventListener.and.callFake(function (name, fn) {
        if (name == 'keydown') {
          keypressCallback = fn;
        }
        if (name == 'keyup') {
          keyupCallback = fn;
        }
      });
      keyboardListener = new KeyboardListener({startNote: 60, endNote: 72});
      onKeyPress = jasmine.createSpy('keyPress');
      onKeyRelease = jasmine.createSpy('keyRelease');
      keyboardListener.on('keyPressed', onKeyPress);
      keyboardListener.on('keyReleased', onKeyRelease);
    });

    it('emits keyPressed and keyReleased for keys within range', function() {
      keypressCallback({
        keyCode: 73
      });
      expect(onKeyPress).toHaveBeenCalledWith(60);
      expect(onKeyRelease).not.toHaveBeenCalled();
      keyupCallback({
        keyCode: 73
      });
      expect(onKeyRelease).toHaveBeenCalledWith(60);
    });

    it('does not emit keyPressed and keyReleased for keys outside the range', function() {
      keypressCallback({
        keyCode: 53
      });
      expect(onKeyPress).not.toHaveBeenCalled();
      keyupCallback({
        keyCode: 53
      });
      expect(onKeyRelease).not.toHaveBeenCalled();
    });

    it('does emit after second keyPressed with the same keyCode', function() {
      keypressCallback({
        keyCode: 73
      });
      onKeyPress.calls.reset();
      keypressCallback({
        keyCode: 73
      });
      expect(onKeyPress).not.toHaveBeenCalled();
    });
  });
});
