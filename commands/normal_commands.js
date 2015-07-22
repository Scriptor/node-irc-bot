module.exports = {
  test: function(chan, message) {
    this.stream.say(chan, 'Test command! - ' + message);
  },
  test_two: function(chan, message) {
    this.stream.say(chan, 'Test command 2! - ' + message);
  },
  s: function(chan, message) {
  	console.log("Search command");
		console.log(message);
  	try{
	 		var match = this.logger.find(message);
			if( match !== null ) {
				var result = message.params.replace(message, message[1]);
			}else{
				var result = "Can't find anything.";
			}
			this.stream.say(chan, result);
  	} catch (err) {
  		console.log("delicious error found", err);
  	}
  }
};
