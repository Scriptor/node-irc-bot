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

          this.db.models['irc-message'].create(data, resolve);
        });
      });
    });
  },

  messagesFor(alias, chan, cb) {
    this.db.models['irc-alias'].one({nick: alias}, (alias) => {
      this.db.models['irc-channel'].one({name: chan}, (chan) => {
        console.log(alias);
        if(alias) {
          var query = {irc_alias_id: alias.id};

          if(chan) query.irc_channel_id = chan.id;

          this.db.models['irc-message'].find(query, cb);
        } else {
          cb([]);
        }
      });
    });
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
