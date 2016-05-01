var MediatorMixin = require('./MediatorMixin');

MidiListener.prototype._emitMidiMessage = function(event) {
  var eventName = {
    148: 'keyPressed',
    132: 'keyReleased'
  }[event.data[0]];
  this.emit(eventName, event.data[1]);
};

function MidiListener () {
  MediatorMixin.call(this);

  if (window.navigator.requestMIDIAccess) {
    window.navigator.requestMIDIAccess({sysex:false})
      .then((midiAccess) => {
        var midiInputs = midiAccess.inputs.values();
        var input = midiInputs.next();
        do {
          input.value.onmidimessage = (event) => this._emitMidiMessage(event);
          input = midiInputs.next();
        } while(!input.done)
      }, () => console.log('Failed to get access to the MIDI device'));
  } else {
    console.log('MIDI API is not available in the browser');
  }
}

module.exports = MidiListener;
