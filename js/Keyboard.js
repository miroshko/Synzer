var Note = require('./Note');
var MediatorMixin = require('./MediatorMixin');

function Keyboard(el) {
  this.el = el;
  this._keysPressed = {};
  MediatorMixin.call(this);
}

Keyboard.prototype.draw = function(lowestNote, highestNote) {
  var key;
  for(var i = lowestNote; i < highestNote; i++) {
    key = document.createElement('div');
    key.dataset.pitch = i;
    key.classList.add('key');
    if (['C#', 'D#', 'F#', 'G#', 'B'].indexOf(new Note(i).letter) > -1) {
      key.classList.add('key-black');
    }
    this.el.appendChild(key);
  }
};

Keyboard.prototype.startMouseListening = function() {
  var this_ = this;

  function pressed(el) {
    if (!el.classList.contains('key'))
      return;
    el.classList.add('pressed');
    this_.emit('notePressed', new Note(el.dataset.pitch));
  }

  function released(el) {
    if (!el.classList.contains('key'))
      return;
    el.classList.remove('pressed');
    this_.emit('noteReleased', new Note(el.dataset.pitch));
  }

  this.el.addEventListener('mousedown', function(e) {
    this_._mouseDown = true;
    pressed(e.target);
  });

  this.el.addEventListener('mouseover', function(e) {
    if (this_._mouseDown) {
      pressed(e.target);
    }
  });

  this.el.addEventListener('mouseleave', function(e) {
    this_._mouseDown = false;
  });

  this.el.addEventListener('mouseout', function(e) {
    if (this_._mouseDown) {
      released(e.target);
    }
  });

  this.el.addEventListener('mouseup', function(e) {
    if (this_._mouseDown) {
      released(e.target);
    }
    this_._mouseDown = false;
  });
};

Keyboard.prototype.on = function(eventName, callback) {
  this._events[eventName] = this._events[eventName] || [];
  this._events[eventName].push(callback);
};

Keyboard.prototype.emit = function(eventName) {
  var args = Array.prototype.slice.call(arguments, 1);

  this._events[eventName].forEach(function(callback) {
    callback.apply(null, args);
  });
};

module.exports = Keyboard;
