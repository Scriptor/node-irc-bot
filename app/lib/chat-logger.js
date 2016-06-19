var ChatLogger = function(db) {
  this.db = db;
};

ChatLogger.prototype = {
  log: function(nick, message) {
    this.db.findOrCreateBy('chat-user', {nick: nick}, function(user) {
      console.log(user.nick);
      user.getMessages(function(err, results) {
        if(err) throw err;
        console.log('Messages');
        console.log(results);
      });
    })
  }
};

module.exports = ChatLogger;
