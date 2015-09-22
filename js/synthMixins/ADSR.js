function ADSR() {
  // S_duration and R_dy are always the rest
  this.ADSR = {
    A_duration: null,
    D_duration: null,
    R_duration: null,
    A_dy: null,
    D_dy: null,
    S_dy: null
  };
}

module.exports = ADSR;