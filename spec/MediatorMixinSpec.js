var MediatorMixin = require('../js/MediatorMixin')

describe('Mediator', function() {
  var obj = {};

  beforeEach(function() {
    MediatorMixin.call(obj);
  });

  it('subscribes', function() {
    expect(function() {
      obj.on('event1');
    }).not.toThrow();
  });

  it('reaches listener if emitted', function(done) {
    obj.on('ev1', function(value) {
      expect(value).toBe(1);
      done();
    });
    obj.emit('ev1', 1)
  });

  it('reaches multiple listeners', function(done) {
    var counter = 0;

    obj.on('ev1', function(a, b) {
      expect(a).toBe(1);
      expect(b).toBe(2);
      if (++counter == 2) done();
    });

    obj.on('ev1', function(a, b, c, d) {
      expect(a).toBe(1);
      expect(b).toBe(2);
      expect(c).toBe(3);
      expect(d).toBe(4);
      if (++counter == 2) done();
    });

    obj.emit('ev1', 1, 2, 3, 4);
  });

  it('does not reach not corresponding listeners', function(done) {
    obj.on('ev1', function() {
      done.fail();
    });
    obj.emit('ev2');
    setTimeout(done);
  });

  it('does not throw if no listener', function() {
    expect(function() { obj.emit('ev1'); }).not.toThrow();
  });
});
