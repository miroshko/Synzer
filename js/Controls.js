var MediatorMixin = require('./MediatorMixin');
var template = require('../tpl/controls.html');

function Controls(el) {
  this.el = el;
  MediatorMixin.call(this);

  this.el.innerHTML = template;
}

Controls.prototype.activate = function() {
  var this_ = this;
  this.el.addEventListener('change', function(e) {
    if (e.target.name == 'wave-form') {
      this_.emit('waveFormChanged', e.target.value);
    }
  })
}

module.exports = Controls;