var Database = require('../../app/lib/database.js');
var ChatLogger = require('../../app/lib/chat-logger.js');

describe('lib/chat-logger', function() {
  var chat_logger;
  var db;

  before(function() {
    db = new Database();

    var token = require('crypto').randomBytes(64).toString('hex');

    return db.connect(token);
  });

  beforeEach(function() {
    chat_logger = new ChatLogger(db);
  });

  describe('messagesFor', function() {
    beforeEach(function() {
      return chat_logger.log('criten', '#webdevvit', 'Hello')
      .then(() => chat_logger.log('criten', '#webdevvit', 'whats up'))
      .then(() => chat_logger.log('criten', '#ruby', 'wrong channel'))
      .then(() => chat_logger.log('angrywombat', '#webdevvit', 'whats up'));
    });

    it('gets the messages for a user', function() {
      return chat_logger.messagesFor('criten', '#webdevvit').then((messages) => {
        messages.forEach((n) => console.log(n.irc_alias_id));
        messages.forEach((n) => console.log(n.irc_channel_id));
        messages.forEach((n) => console.log(n.content));
        expect(messages.length).to.equal(2);
      });
    });
  });
});
