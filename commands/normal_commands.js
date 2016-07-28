var fs = require('fs');

module.exports = {
  timeshifter: function(chan, message, from){
    var MarkovChain = require('markovchain')
      , fs = require('fs')
      , quotes = new MarkovChain(fs.readFileSync(__dirname + '/../logs/#_r_webdev.txt', 'utf8'));

      this.stream.say(chan, quotes.start('<timeshifter>:').end(15).process() );
  },
   timeshifter2: function(chan, message, from){
    var MarkovChain = require('markovchain')
      , fs = require('fs')
      , quotes = new MarkovChain(fs.readFileSync(__dirname + '/../logs/timeshifter.txt', 'utf8'));

      this.stream.say(chan, quotes.start('<timeshifter>:').end(15).process() );
  },
  nig: function(chan, message, from){
      this.stream.say(chan, '.addpoint niggers');
  },
  markov: function(chan, message, from){
    this.stream.say(chan, 'omg no i suck');
      return;
    var MarkovChain = require('markovchain')
      , fs = require('fs')
      , quotes = new MarkovChain(fs.readFileSync(__dirname + '/../logs/##webdevvit.txt', 'utf8'));
    var params = message.split(' ');
    var seeder = from;
    console.log(params);
    if( params[1] !== undefined ){
        seeder = params[1];
    }

    console.log('seeder set to ' + seeder);

    this.stream.say(chan, quotes.start('<'+seeder+'>:').end(15).process() );
  }, topic: function(chan, message, from){
    var new_title = message.trim() + " (" + from + ")";
    console.log("Attempting to set topic to " + new_title);
    try{
      var result = this.stream.send("TOPIC", chan, new_title);
    } catch (err) {
      console.log("Error detected");
    }
  },
  c: function(chan, message, from, use_find, set_topic){
    console.log("-- CHAINED Search command --");
    console.log(message);
    try{
      var parts = message.split('/');
      console.log(parts);
      console.log(parts.length);

      // First, find an initial match
      use_find = true;
      if( use_find === false ){
        console.log("Fun mode");
        var match = this.logger.fun_search(chan, parts[1], 5000);
      }else{
        console.log("Srs mode");
        var match = this.logger.srs_search(chan, parts[1], 10);
      }

      console.log(match);

      // Now replace the chained searches
      if( match !== null ){
        console.log('Chained match found!');
        for( var i = 1; i < ( parts.length - 1); i += 2){
          var search = parts[i];
          var replace = parts[ i + 1];
          match = match.replace(search, this.colors.bold(replace));
        }
      }

      if( set_topic === true ){
			  console.log('topic mode');
			  this.stream.send('TOPIC', chan, match);
			}else{
			  this.stream.say(chan, match);
			}
  	} catch (err) {
  	  console.log(err);
  	  console.log(err.stack);
  		this.stream.say(chan, "DISGUSTING LOVICH ERROR FOUND: No matches, you fucking qwebber");

      if( set_topic === true ){
        // super egregious bro
        var msg = 'AKICK ' + chan + ' ADD ' + from + ' !T 20 timeout';
        this.stream.say('CHANSERV',  msg);
      }else{
        this.stream.send("KICK", chan, from, "HARDMODE MOTHERFUCKER");
      }
  	}
  },
  s: function(chan, message, from, use_find, set_topic) {
  	console.log("-- Search command --");
    console.log(message);
    var initial_index = message;
    try{
      if( message.indexOf(' && ') > -1 ){
        console.log('defining subparts');
        var subparts = message.split(' && ') ;
        message = message.split(' ').splice(' &&');
        initial_index = message[0];
      }

      var parts = initial_index.split("/");
      console.log(parts);
      if( use_find === false ){
        console.log("Fun mode");
        var match = this.logger.fun_search(chan, parts[1], 5000);
      }else{
        console.log("Srs mode");
        var match = this.logger.srs_search(chan, parts[1], 10);
      }

      if( match !== null ) {
        if( subparts !== undefined ){
          console.log('chained s// event!');
          delete subparts[0];
          var result = match.replace(parts[1], this.colors.bold(parts[2]));
          for(var i in subparts){
            var replace_parts = subparts[i].split('/');
            result = result.replace(replace_parts[1], this.colors.bold(replace_parts[2]));
          }
        }else{
          console.log('single s// event!');
          console.log(match);
  				var result = match.replace(parts[1], this.colors.bold(parts[2]));
        }
			}

			if( set_topic === true ){
			  console.log('topic mode');
			  this.stream.send('TOPIC', chan, result);
			}else{
			  this.stream.say(chan, result);
			}
  	} catch (err) {
  		this.stream.say(chan, "DISGUSTING LOVICH ERROR FOUND: No matches, you fucking qwebber");

      if( set_topic === true ){
        // super egregious bro
        var msg = 'AKICK ' + chan + ' ADD ' + from + ' !T 20';
        this.stream.say('CHANSERV',  msg);
      }else{
        this.stream.send("KICK", chan, from, "HARDMODE MOTHERFUCKER");
      }
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
            this.stream.last_kicker = null;
            this.stream.say(chan, from + ': omg stahp (for 2mins)');
            var msg = 'AKICK ' + chan + ' ADD ' + from + ' !T 2';
            this.stream.say('CHANSERV',  msg);
            return;
        }
    }

    this.stream.last_kicker = from;
    this.stream.kick_expiry = now.setHours( now.getHours() +1);

    if( users.indexOf(this.name) > -1 ){
        this.stream.send('KICK', chan, from, "Nice try faggot");
        return;
    }

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
        this.stream.say(chan, from + ': omg stahp (for 720 mins)');
        var msg = 'AKICK ' + chan + ' ADD ' + from + ' !T 720';
        this.stream.say('CHANSERV',  msg);
    }
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
    var sleep = require('sleep');
    var invitees = message.trim().split(" ");
    console.log(invitees);
    for( var i in invitees ){
      if( invitees[i].toLowerCase() in this.ignoredUsers ){
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
      this.invites.recordInvite(chan, invitees[i]);
      sleep.sleep(1);
    }
    this.stream.say(chan, 'k.');
  },
  rekt: function(chan, message, from) {
    this.stream.send("KICK", chan, from, "rek this fgt");
  },
  tell: function(chan, message, from){
    console.log('normal tell');
    var parts = message.trim().split(' ');
    var to = parts[0];
    delete parts[0];
    parts = parts.join(' ');
    var status = this.williamTell.recordTell(chan, to, parts, from, this.colors);
    if( status ){
      this.stream.say(chan, from + ': k.');
    }else{
      this.stream.say(chan, from + ': can`t help you cheech');
    }
  },
  seen: function(chan, message, from){
    var targets = message.trim().split(' ');
    console.log(targets);
    for( var i in targets ){
      var result = this.seent.haveSeen(chan, targets[i]);
      if( result ){
        var msg = [this.colors.bold(targets[i]), 'was last seen', result].join(' ');
      }else{
        var msg = [this.colors.bold(targets[i]), '-- now thats a name that ive not heard in a long time.'].join(' ');
      }
      this.stream.say(chan, msg);
    }
  },
  help: function(chan, message, from){
    this.stream.say(chan, 'you need mental help');
  },
  pride: function(chan, message, from){
    this.stream.say(chan, this.colors.rainbow(message.trim()));
  }

};

RegExp.escape= function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};
