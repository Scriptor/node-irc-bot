module.exports = {
  topic: function(chan, message, from){
    var new_title = message.trim() + " (" + from + ")";
    console.log("Attempting to set topic to " + new_title);
    try{
      var result = this.stream.send("TOPIC", chan, new_title);
    } catch (err) {
      console.log("Error detected");
    }
  },
  test_two: function(chan, message) {
    this.stream.say(chan, 'Test command 2! - ' + message);
  },
  s: function(chan, message) {
  	console.log("Search command");
    try{
      var parts = message.split("/");
	 		var match = this.logger.find(parts[1], 5000);
			
      if( match !== null ) {
        console.log(match);
				var result = match.replace(parts[1], "_" + parts[2] + "_");
        // String.fromCharCode(parseInt("0002",16))
			}else{
				var result = "Can't find anything.";
			}

			this.stream.say(chan, result);
  	} catch (err) {
  		console.log("delicious error found", err);
  	}
  }
};
