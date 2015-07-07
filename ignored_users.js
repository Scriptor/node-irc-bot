module.exports = {
  nicks: ['squishyj'],

  includes: function(nick) {
    return this.nicks.indexOf(nick) !== -1;
  }
}
