module.exports = {
  nicks: ['angrywombat', 'veonik', 'Criten'],

  includes: function(nick) {
    return this.nicks.indexOf(nick) !== -1;
  }
}
