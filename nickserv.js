module.exports = {
  has_authed: false,

  handle: function(from, to, text, message) {
    this.received_message(message);
  },

  auth: function( scope_helper ) {
    console.log('Attempting nickserv auth..');
    scope_helper.bot.say('NICKSERV', 'identify ' + scope_helper.config.botPass);
    this.has_authed = true;
  },

  received_message: function(message) {
    bot.say('angrywombat', 'Message from NICKSERV: ' + message);
  }
}
