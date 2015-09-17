var Note = require('../js/Note');

fdescribe('Note', function() {
  it('can be created with pitch', function() {
    var note1 = new Note(21);
    expect(note1.letter).toEqual("A");
    expect(note1.pitch).toEqual(21);
    expect(note1.octave).toEqual(0);
  });

  it('can be created with letter notation', function() {
    var note1 = new Note("C#4");
    expect(note1.letter).toEqual("C#");
    expect(note1.pitch).toEqual(61);
    expect(note1.octave).toEqual(4);
  });

  it('throws if invalid input', function() {
    expect(function() {new Note();}).toThrow();
    expect(function() {new Note(2);}).toThrow();
    expect(function() {new Note("nn");}).toThrow();
    expect(function() {new Note("N#6");}).toThrow();
  });
});