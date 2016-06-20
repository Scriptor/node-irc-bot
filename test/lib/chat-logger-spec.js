var Database = require('../../app/lib/database.js');
var ChatLogger = require('../../app/lib/chat-logger.js');

describe('lib/chat-logger', function() {
  var chat_logger;
  var db;

  before(function() {
    return new Promise((resolve, reject) => {
      db = new Database();

      db.connect('test-db2').then(() => {
        resolve();
      });
    });
  });

  beforeEach(function() {
    chat_logger = new ChatLogger(db);
  });

  describe('log', function() {
    it('logs a message', function() {
      chat_logger.log('foo', 'bar', 'Hello');
    });

  });

  describe('messagesFor', function() {
    it('gets the messages for a user', function() {
      return new Promise((resolve) => {
        chat_logger.log('criten', '#webdevvit', 'Hello').then(() => {
          chat_logger.messagesFor('criten', '#webdevvit', function(messages) {
            expect(messages.length).to.equal(0);
            resolve();
          });
        });
      });
    });
  });
});
