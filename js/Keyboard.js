function Keyboard(el) {
  this.el = el;
  this._events = {};
}

Keyboard.prototype.pitchToNote = function(pitch) {
  // 21 == A0
  pitch = parseInt(pitch);
  if (isNaN(pitch) || pitch < 21 || pitch > 108)
    throw new Error(pitch + ' is an invalid pitch');

  var notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'B', 'H'];
  var letter = notes[(pitch - 21 + 9) % 12];
  var octave = Math.floor((pitch - 12) / 12);
  return {letter: letter, octave: octave};
};

Keyboard.prototype.draw = function(lowestNote, highestNote) {
  var key;
  for(var i = lowestNote; i < highestNote; i++) {
    key = document.createElement('div');
    key.dataset.pitch = i;
    key.classList.add('key');
    if (['C#', 'D#', 'F#', 'G#', 'B'].indexOf(this.pitchToNote(i).letter) > -1) {
      key.classList.add('key-black');
    }
    this.el.appendChild(key);
  }
};

Keyboard.prototype.startMouseListening = function() {
  var this_ = this;
  this.el.addEventListener('mousedown', function(e) {
    this_.emit('notePressed', e.target.dataset.pitch);
  });

  this.el.addEventListener('mouseup', function(e) {
    this_.emit('noteReleased', e.target.dataset.pitch);
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
