module.exports = {
  test: function(chan, message) {
    this.stream.say(chan, 'Test command! - ' + message);
  },

  test_two: function(chan, message) {
    this.stream.say(chan, 'Test command 2! - ' + message);
  },

  s: function(chan, message) {
  	console.log("Search command");
  	try{
  		this.logger.find(message);
  	} catch (err) {
  		console.log("delicious error found", err);
  	}
  }
};
