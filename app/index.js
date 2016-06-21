var Database = require('./lib/database.js');
var ChatLogger = require('./lib/chat-logger.js');

var db = new Database();

db.connect('dev').then(function() {
  var chat_logger = new ChatLogger(db);

  //chat_logger.log('Criten', 'Veonik Sucks', 'My Message');
  chat_logger.messagesFor('Criten', 'Veonik Sucks', function(err, results) {
    console.log(results);
  });
}, function(err) {
  console.log('Error connecting to the database...');
  console.log(err);
});
