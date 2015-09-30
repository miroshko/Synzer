var Note = require('./Note');
var MediatorMixin = require('./MediatorMixin');

function Keyboard(el) {
  this.el = el;
  this._keysPressed = {};
  MediatorMixin.call(this);

  this._onKeyEvent = this._onKeyEvent.bind(this);
}

Keyboard.prototype.draw = function(lowestNote, highestNote) {
  var key;
  this._lowestNote = lowestNote;
  this._highestNote = highestNote;
  this._keysBeingPressed = {};

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

Keyboard.prototype._onKeyEvent = function(e) {
  var keysAvailable = [
    81, 50, 87, 51, 69, 82, 53, 84, 54, 90, 55, 85,
    73, 57, 79, 48, 80, 186, 65, 89, 83, 88, 68, 67,
    86, 71, 66, 72, 78, 77, 75, 188, 76, 190, 192, 189
  ];

  var index = keysAvailable.indexOf(e.which);
  var pitch = this._lowestNote - this._lowestNote % 12 + index;
  var eventToEmit = null;
  if (e.type == 'keydown' && !this._keysBeingPressed[pitch]) {
    this._keysBeingPressed[pitch] = true;
    eventToEmit = 'notePressed';
  }
  if (e.type == 'keyup') {
    this._keysBeingPressed[pitch] = false;
    eventToEmit = 'noteReleased';
  }
  if (eventToEmit) {
    var note = new Note(pitch);
    this.emit(eventToEmit, note);
  }
};

Keyboard.prototype.startKeyboardListening = function() {
  window.addEventListener('keydown', this._onKeyEvent);
  window.addEventListener('keyup', this._onKeyEvent);
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
