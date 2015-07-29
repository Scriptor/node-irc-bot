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
  s: function(chan, message, from) {
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
