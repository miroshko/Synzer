var Wave = require('./Wave');
var Keyboard = require('./Keyboard');

var keyboardEl = document.querySelector('.keyboard');
keyboard = new Keyboard(keyboardEl);
keyboard.draw('10', '20');

keyboard.on('notePressed', function() {

});
keyboard.on('noteReleased', function() {

});