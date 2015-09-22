function ADSR() {
  // S_duration and R_dy are always the rest
  this.ADSR = {
    A: null,
    D: null,
    S: null,
    R: null
  };
}

module.exports = ADSR;