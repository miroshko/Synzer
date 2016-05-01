var Note = require('./Note');
var MediatorMixin = require('./MediatorMixin');

function Keyboard(el) {
  this.el = el;
  this._keysPressed = {};
  MediatorMixin.call(this);
}

Keyboard.prototype.draw = function(lowestNote, highestNote) {
  var key;
  this._keyEls = {};
  for(var i = lowestNote; i <= highestNote; i++) {
    this._keyEls[i] = key = document.createElement('div');
    key.dataset.pitch = i;
    key.classList.add('key');
    if (['C#', 'D#', 'F#', 'G#', 'B'].indexOf(new Note(i).letter) > -1) {
      key.classList.add('key-black');
    }
    this.el.appendChild(key);
  }
};

Keyboard.prototype.press = function(pitch) {
  var el = this._keyEls[pitch];
  el.classList.add('pressed');
  this.emit('notePressed', new Note(el.dataset.pitch));
};

Keyboard.prototype.release = function(pitch) {
  var el = this._keyEls[pitch];
  el.classList.remove('pressed');
  this.emit('noteReleased', new Note(el.dataset.pitch));
};

Keyboard.prototype.startMouseListening = function() {
  this.el.addEventListener('mousedown', (e) => {
    if (!e.target.classList.contains('key'))
      return;
    this._mouseDown = true;
    this.press(e.target.dataset.pitch);
  });

  this.el.addEventListener('mouseover', (e) => {
    if (!e.target.classList.contains('key'))
      return;
    if (this._mouseDown) {
      this.press(e.target.dataset.pitch);
    }
  });

  this.el.addEventListener('mouseleave', (e) => {
    if (!e.target.classList.contains('key'))
      return;
    this._mouseDown = false;
  });

  this.el.addEventListener('mouseout', (e) => {
    if (!e.target.classList.contains('key'))
      return;
    if (this._mouseDown) {
      this.release(e.target.dataset.pitch);
    }
  });

  this.el.addEventListener('mouseup', (e) => {
    if (!e.target.classList.contains('key'))
      return;
    if (this._mouseDown) {
      this.release(e.target.dataset.pitch);
    }
    this._mouseDown = false;
  });
};

module.exports = Keyboard;
