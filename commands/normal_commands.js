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
  s: function(chan, message, from, use_find, set_topic) {
  	console.log("-- Search command --");
    try{
      var parts = message.split("/");
      if( use_find === false ){
          console.log("Fun mode");
          var match = this.logger.fun_search(chan, parts[1], 5000);
      }else{
        console.log("Srs mode");
        var match = this.logger.srs_search(chan, parts[1], 10);
      }

      if( match !== null ) {
				var result = match.replace(parts[1], "_" + parts[2] + "_");
        // String.fromCharCode(parseInt("0002",16))
			}else{
				var result = from + ' is a disgusting lovich.';
			}
			
			if( set_topic === true ){
			  console.log('topic mode');
			  this.stream.send('TOPIC', chan, result);
			}else{
			  this.stream.say(chan, result);  
			}
  	} catch (err) {
  		this.stream.say(chan, "DISGUSTING LOVICH ERROR FOUND: No matches, you fucking qwebber");
      this.stream.send("KICK", chan, from, "HARDMODE MOTHERFUCKER");
  	}
  },

  aliaslist: function(chan, message) {
    console.log(this.commands);

  },
  mk: function(chan, message, from){
      this.maybe_kick(chan, message, from);
  },
  loldongs: function(chan, message, from){
    this.stream.say(chan, '!fight {0}');
    this.fight = {
        status: true,
        instigator: this.name, // lol
        current_health: 100,
        members: [message.split(' ')[1]]
    }
  },


  /*
   * Allows a user to kick another user with 1 in 10 odds.
   * Will also kick the person requesting the kick with 1 in 100 odds.
   */
  maybe_kick: function(chan, message, from) {
    console.log("Maybe kick?");
    var target_straw = Math.round(Math.random() * 10);
    var belligerent_straw = Math.round(Math.random() * 20);
    var user = message.trim();
    var users = user.split(" ");
    var now = new Date();
    if( this.stream.last_kicker !== undefined ){
        if( this.stream.last_kicker == from  ){
            this.stream.send("KICK", chan, from, "omg stahp");
            return;
        }
    }

    this.stream.last_kicker = from;
    this.stream.kick_expiry = now.setHours( now.getHours() +1);

    // Possibly kick the target
    if( target_straw == 1 ){
      try{
        if( users.length > 1 ){
            for( var i in users ) {
                //this.stream.say(chan, users[i] + ": I'm the juggernaut, bitch.");
                this.stream.send("KICK", chan, users[i], "I'm the juggernaut, bitch.");
            }
        }else{
          this.stream.say(chan, user + ": I'm the juggernaut, bitch.");
          this.stream.send("KICK", chan, user);
        }
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
        this.stream.send("KICK", chan, from);
      }catch (e) {
        console.log("Maybe kick, definite error: " + e);
      }
    }
  },
  ascii: function(chan, message, from) {
    this.stream.say(chan, from + ": Fuck you.");
  },
  oppls: function(chan, message, from) {
 //   return this.stream.say(chan, "sorry, " + from + ", veonik is why we can't have nice things. :|");
    /*var tora_check = from.toLowerCase();
        if( tora_check == "omfgtora" || tora_check == "gofsckurself" || tora_check == "gofsckyourself" || tora_check == "tora_" ){
            this.stream.send("KICK", chan, from, "1 + 1 = fuck you");
        }*/
    var bad_day = Math.round(Math.random() * 10);
    if( bad_day == 3 ){
        this.stream.send('MODE', chan, '+o', from);
    }else{
        this.stream.send('KICK', chan, from, 'donger stole all my chopsticks');
    }
  },
  fight: function(chan, message, from) {
       this.stream.send("KICK", chan, from, "suck my dong");
  },
  deathmatch: function(chan, message, from) {
       this.stream.send("KICK", chan, from, "suck my dong");
  },
  ascii: function(chan, message, from){
      if( this.figlet !== undefined ){
          console.log('figlet exists!');
      }else{
          console.log('no figlet');
      }
  },
  slap: function(chan, message, from){
      this.stream.send("KICK", chan, from, "this is a timeshifter alias!");
  },
  ladies: function(chan, message, from){
      this.stream.say(chan, '( ͡° ͜ʖ ͡° )');
      this.stream.say(chan, '( ͡⊙ ͜ʖ ͡⊙ )');
      this.stream.say(chan, '( ͡◉ ͜ʖ ͡◉ )');
  },
  unban: function(chan, message, from){
    this.stream.say("chanserv", "clear " + chan + " bans");
  },
  invite: function(chan, message, from) {
    var invitees = message.split(" ");
    console.log(from);
    for( i = 1; i < invitees.length; i++ ){
        if( invitees[i].toLowerCase() == 'timeshifter' || invitees[i].toLowerCase() == 'lovich'){
          this.stream.say(chan, "sorry i dont invite laxatives");
          continue;
        }else if(invitees[i].toLowerCase() == 'laxatives' ){
             this.stream.send('KICK', chan, from, 'lol u dum');
             continue;
        }
      if( invitees[i].toLowerCase() == from.trim() ){
           this.stream.say(from + ": are you retarded?");
           continue;
      }
      console.log("Inviting user " + invitees[i]);
      this.stream.send("INVITE", invitees[i], chan);
    }
  },
  rekt: function(chan, message, from) {
    this.stream.send("KICK", chan, from, "rek this fgt");
  }

};

RegExp.escape= function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}
