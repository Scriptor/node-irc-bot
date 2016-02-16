module.exports = {
  nicks: ['squishyj', 'deckard', 'omfgtora'],

  includes: function(nick) {
    return this.nicks.indexOf(nick) !== -1;
  }
}
