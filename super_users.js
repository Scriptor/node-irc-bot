module.exports = {
  nicks: ['angrywombat', 'Criten'],

  includes: function(nick) {
    return this.nicks.indexOf(nick) !== -1;
  }
}
