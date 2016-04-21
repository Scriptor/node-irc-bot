module.exports = {
  nicks: ['squishyj', 'deckard' ],

  includes: function(nick) {
    return this.nicks.indexOf(nick) !== -1;
  }
}
