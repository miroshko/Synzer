var Wave = require('./Wave');
var Keyboard = require('./Keyboard');

var keyboardEl = document.getElementById('.keyboard');
keyboard = new keyboard(keyboardEl);
keyboard.draw('E3', 'E5');

keyboard.on('notePressed', function() {

});
keyboard.on('noteReleased', function() {

});