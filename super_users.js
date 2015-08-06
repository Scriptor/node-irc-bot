module.exports = {
  nicks: ['angrywombat', 'Criten', 'mtyson'],

  includes: function(nick) {
    return this.nicks.indexOf(nick) !== -1;
  }
}
