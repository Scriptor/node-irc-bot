var ChatLogger = function(db) {
  this.db = db;
};

ChatLogger.prototype = {
  log(nick, chan, content) {
    return new Promise((resolve) => {

      this.db.findOrCreateBy('irc-alias', {nick: nick}, (alias) => {
        this.db.findOrCreateBy('irc-channel', {name: chan}, (channel) => {
          var data = {
            irc_alias_id: alias.id,
            irc_channel_id: channel.id,
            content: content
          };

          console.log(data);

          this.db.models['irc-message'].create(data, resolve, function(err, results) {
            console.log(err);
            console.log(results.content);
          });
        });
      });
    });
  },

  messagesFor(nick, chan, cb) {
    this.db.models['irc-message'].findByIrc_alias({nick: nick}).findByIrc_channel({name: chan}, cb);
  },

  seen(nick, chan) {
    user.getMessages(function(err, results) {
      if(err) throw err;

      console.log('Messages');
      console.log(results);
    });
  }
};

module.exports = ChatLogger;
