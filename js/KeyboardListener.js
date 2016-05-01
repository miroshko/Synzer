var MediatorMixin = require('./MediatorMixin');

const KEYCODE_TO_PITCH_MAP = {
  81: 48,
  50: 49,
  87: 50,
  51: 51,
  69: 52,
  82: 53,
  53: 54,
  84: 55,
  54: 56,
  90: 57,
  55: 58,
  85: 59,
  73: 60,
  57: 61,
  79: 62,
  48: 63,
  80: 64,
  186: 65,
  65: 66,
  89: 67,
  83: 68,
  88: 69,
  68: 70,
  67: 71,
  86: 72,
  71: 73,
  66: 74,
  72: 75,
  78: 76,
  77: 77,
  75: 78,
  188: 79,
  76: 80,
  190: 81,
  192: 82,
  189: 83
};

KeyboardListener.prototype.KEYCODE_TO_PITCH_MAP;

function KeyboardListener (options) {
  options = Object.assign({}, options);
  MediatorMixin.call(this);

  if (!options.startNote || options.startNote < 48) {
    throw new Error('startNote must be a number greater or equal than 48');
  }

  if (!options.endNote || options.endNote > 83) {
    throw new Error('endNote must be a number less or equal than 83');
  }

  this._options = options;
  this._buttonStatuses = {};

  var emitPitch = (name) => (e) => {
    var pitch = KEYCODE_TO_PITCH_MAP[e.keyCode];
    if (pitch && pitch >= this._options.startNote && pitch <= this._options.endNote && this._buttonStatuses[pitch] != name) {
      this.emit(name, pitch);
    }
    this._buttonStatuses[pitch] = name;
  }

  global.window.addEventListener('keydown', emitPitch('keyPressed'));
  global.window.addEventListener('keyup', emitPitch('keyReleased'));
}

module.exports = KeyboardListener;
