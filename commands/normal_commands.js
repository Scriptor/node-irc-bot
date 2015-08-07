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
    try{
      var parts = message.split("/");
	 		var match = this.logger.find(chan, parts[1], 5000);

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
  },

  aliaslist: function(chan, message) {
    console.log(this.commands);

  },


  /*
   * Allows a user to kick another user with 1 in 10 odds.
   * Will also kick the person requesting the kick with 1 in 100 odds.
   */
  maybe_kick: function(chan, message, from) {
    var target_straw = Math.round(Math.random() * 10);
    var belligerent_straw = Math.round(Math.random() * 20);
    var user = message.trim();

    // Possibly kick the target
    if( target_straw == 1 ){
      try{
        this.stream.say(chan, user + ": I'm the juggernaut, bitch.");
        this.stream.send("KICK", chan, user);
      }catch (e) {
        console.log("Maybe kick, definite error: " + e);
      }
    }else{
      this.stream.say(chan, user + ": You have been spared by fate.");
    }

    // Possibly kick the belligerent 
    if( belligerent_straw == 1 ){
      try{
        this.stream.say(chan, from + ": I'm the juggernaut, bitch.");
        this.stream.send("KICK", chan, user);
      }catch (e) {
        console.log("Maybe kick, definite error: " + e);
      }
    }
  },
};
