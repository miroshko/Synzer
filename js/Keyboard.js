var Note = require('./Note');
var MediatorMixin = require('./MediatorMixin');

function Keyboard(el) {
  this.el = el;
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
  this.el.addEventListener('mousedown', function(e) {
    this_.emit('notePressed', new Note(e.target.dataset.pitch));
  });

  this.el.addEventListener('mouseup', function(e) {
    this_.emit('noteReleased', new Note(e.target.dataset.pitch));
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
