function Keyboard(el) {
  this.el = el;
}

Keyboard.prototype.draw = function(lowestNote, highestNote) {
  this.el.innerHTML = '';
  for(var note in ['C', 'D', 'E', 'F', 'G', 'A', 'H']) {
    
  }
};



module.exports = Keyboard;