var ChatLogger = function(db) {
  this.db = db;
};

ChatLogger.prototype = {
  log: function(nick, message) {
    this.db.findOrCreateBy(this.db.ChatUser, {nick: nick}, function(user) {
      console.log(user.nick);
    })
  }
};

module.exports = ChatLogger;
