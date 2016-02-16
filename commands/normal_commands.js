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
  s: function(chan, message, from, use_find) {
  	console.log("Search command");
    try{
	var tora_check = from.toLowerCase();
        if( tora_check == "omfgtora" || tora_check == "gofsckurself" || tora_check == "gofsckyourself" || tora_check == "tora_" ){
            this.stream.send("KICK", chan, from, "1 + 1 = fuck you");
            //return;
      }
      var parts = message.split("/");
      if( use_find === false ){
          console.log("use_find is false");
          var match = this.logger.search(chan, parts[1], 5000);
      }else{
        console.log("use_find is false or something");
        var match = this.logger.find(chan, parts[1], 5000);
      }

      if( match !== null ) {
        console.log(match);
				var result = match.replace(parts[1], "_" + parts[2] + "_");
        // String.fromCharCode(parseInt("0002",16))
			}else{
				var result = "Can't find anything.";
			}

			this.stream.say(chan, result);
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

    /*if( this.stream.kick_expiry !== undefined ){
        var diff = now - this.stream.kick_expiry;
        console.log(this.stream.kick_expiry);
        this.stream.say(chan, "You can't do that until " + new Date(this.stream.kick_expiry).toString());
        if( now > 0 ) {
            console.log("now diff is " + new Date(diff).toISOString());
            return;
        }else{
            console.log("looks like this kick can happen?");
        }
    }*/

    this.stream.kick_expiry = now.setHours( now.getHours() +1);

    // Possibly kick the target
    if( target_straw == 1 ){
      try{
        if( users.length > 1 ){
            for( i in users ) {
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
  lolfight: function(chan, message, from) {
    this.stream.say(chan, "I will not participate in this butchery");
    return;
    var players = [],
      participants = message.split(" "),
      actions = [
        '{0} smashes {1} in the face with a {2}',
        '{0} eviscerates {1} while using {2} as a sex toy',
        '{0} blames {1} for setting fire to the {2}',
        'A REAL SLOBBERKNOCKER HAS STARTED BETWEEN {0} and {1}'
      ],
      objects = [
        'elephant teeth',
        'large dildo',
        'PaperMate(r) FLAIR M pen (blue)',
        'PaperMate(r) FLAIR M pen (red)',
        'PaperMate(r) FLAIR M pen (black)',
        'rusty razor blade',
        'Nokia brick phone',
        'dead mouse tail',
        'Coraline'
      ],
      game_id = Math.floor(Math.random() * 1000),
      prefix = "[Fight Game " + game_id + "] - ",
      everyone_dead = false;

    participants = participants.filter( onlyUnique );

    // Add players
    for( i in participants ){
      var p = participants[i];
      if( p.length > 0 ){
        players.push(p);
      }
    }

    console.log(participants, players);
    if( players.length <= 1 ){
      // @TODO just randomly grab users in the channel
      console.log("Not enough people to fight");
      return;
    }

    do {
      // Generate the announcement
      var annouce_i = Math.floor(Math.random() * actions.length),
          player_1 = Math.floor(Math.random() * players.length),
          player_2 = Math.floor(Math.random() * players.length),
          object_i = Math.floor(Math.random() * objects.length);

      console.log(players[ player_1 ]);
      console.log(players[ player_2 ]);
      console.log(objects[ object_i ]);

      var message = actions[ annouce_i ];
      message.replace('{0}', players[ player_1 ]);
      message.replace('{1}', players[ player_2 ]);
      message.replace('{2}', objects[ object_i ]);


      // Determine who will die
      var i = [ Math.floor(Math.random() * players.length) ];
      this.stream.send("KICK", chan, players[i]);
      players.splice(i, 1);

      // Announce! Try to imagine this as JR from WWE
      this.stream.say(chan, prefix + message);

      // Lets see if anyone is left
      if( players.length <= 1 ) {
        // Winner
        this.stream.say(chan, prefix + players[0] + " is the winner!");
        everyone_dead = true;
      }

      // Slow it down
      //sleep(2);
    }
    while( everyone_dead === false );


  },
  ascii: function(chan, message, from) {
    this.stream.say(chan, from + ": Fuck you.");
  },
  oppls: function(chan, message, from) {
    return this.stream.say(chan, "sorry, " + from + ", veonik is why we can't have nice things. :|");
    var tora_check = from.toLowerCase();
        if( tora_check == "omfgtora" || tora_check == "gofsckurself" || tora_check == "gofsckyourself" || tora_check == "tora_" ){
            this.stream.send("KICK", chan, from, "1 + 1 = fuck you");
        }
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
  /*rename: function(chan, message, from) {
      var tora_check = from.toLowerCase();
      return this.stream.say(chan, "Tora is why we can't have nice things.");
        if( tora_check == "omfgtora" || tora_check == "gofsckurself" || tora_check == "gofsckyourself" || tora_check == "tora_" ){
            this.stream.send("KICK", chan, from, "1 + 1 = fuck you");
        }
      var new_name = message.trim().split(' ');
      console.log('Renaming to ', message.trim());
      this.stream.send('NICK', new_name[0]);
  },*/
  slap: function(chan, message, from){
      this.stream.send("KICK", chan, from, "this is a timeshifter alias!");
  },
  fag: function(chan, message, from){
    console.log('Saying ascii fag');
    this.stream.say(chan, ' __    __  __  __ ___    ');
    this.stream.say(chan, '|_ /\ / _ / _ /  \ |   | ');
    this.stream.say(chan, '| /--\\__)\__)\__/ |   . ');
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
