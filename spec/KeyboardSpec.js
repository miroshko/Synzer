var Keyboard = require('../js/Keyboard');

describe('Keyboard', function() {
  var keyboard;

  beforeEach(function() {
    keyboard = new Keyboard;
  });

  afterEach(function() {
  });

  it('converts pitch to letter note', function() {
    expect(keyboard.pitchToNote(21)).toEqual({letter: 'A', octave: 0});
    expect(keyboard.pitchToNote(61)).toEqual({letter: 'C#', octave: 4});
    expect(keyboard.pitchToNote("64")).toEqual({letter: 'E', octave: 4});
    expect(function() {keyboard.pitchToNote();}).toThrow();
    expect(function() {keyboard.pitchToNote(2);}).toThrow();
    expect(function() {keyboard.pitchToNote("nn");}).toThrow();
  });
});