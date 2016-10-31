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
  		this.stream.say(chan, "DISGUSTING TIMESHITTER ERROR FOUND: No matches, you fucking qwebber");

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
  		this.stream.say(chan, "DISGUSTING TIMESHIFTER ERROR FOUND: No matches, you fucking qwebber");

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
    
    var bad_day = Math.round(Math.random() * 10);
    if( bad_day == 3 ){
        this.stream.send('MODE', chan, '+o', from);
    }else{
        this.stream.say(chan, from + ': omg stahp (for 2 mins)');
        var msg = 'AKICK ' + chan + ' ADD ' + from + ' !T 2';
        this.stream.say('CHANSERV',  msg);
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
      }else if (invitees[i].toLowerCase() == 'timeshifter'){
        this.stream.say(chan, 'timeshifter is already in here retard');
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
    var sleep = require('sleep');
    console.log(targets);
    for( var i in targets ){
      sleep.sleep(1);
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
    var msg = 'AKICK ' + chan + ' ADD ' + from + ' !T 1 timeout';
    this.stream.say('CHANSERV',  msg);
    
  },
  pride: function(chan, message, from){
    this.stream.say(chan, this.colors.rainbow(message.trim()));
  },
  exec: function(chan, message, from){
    var sleep = require('sleep');
    this.stream.say(chan, from + ': one moment please while I run that through kubernetes for you..');
    sleep.sleep( 10 );
    this.stream.send('KICK', chan, from, 'ill send you to /dev/null faggot');
  },
  addpoint: function(chan, message, from){
    this.stream.say(chan, '*addpoint wambot');
    this.stream.say(chan, from + ': suck it');
  },
  rmpoint: function(chan, message, from){
    this.stream.send('KICK', chan, from, 'i have removed all your points, fgt');
  },
  man: function(chan, message, from){
    console.log('hallllllpin');
    var man_topics = {
        timeshifter: 'A fun little markov chain from #/r/webdev logs seeded by a timeshifter log entry. Does not take arguments, cause you\'re a faggot.',
        timeshifter2: 'A more nonsensical markov chain than !timeshifter. This one uses a timeshifter-only log.',
        nig: 'A politically correct way of stimulating conversation in a channel.',
        markov: 'The name is mark, asshole.',
        topic: 'Sets:he topic for the channel, assuming some faggot named veonik didn\'t deop me.',
        c: 'A chained s// search/replace implementation. Does not use regex so it\'s not a real s// function, shut the fuck up already. The first slashie arg determines the log entry, subsequent argies must be within the log entry. Hardmode enabled.',
        t: 'A chained s// search/replace implementation that outputs to the /topic. Does not use regex so it\'s not a real s// function, shut the fuck up already. Egregious hardmode enabled (akick, 2min.',
        s: 'An s// search/replace implementation. Does not use regex so it\'s not a real s// function, shut the fuck up already. Hardmode enabled. You can chain it with s// & s//, but thats the same as c// you retard.',
        r: 'An s// search/replace implementation. Uses regex but it searches the log (5k line length asendinglyishly or whatever the fuck.',
        aliaslist: 'There are no aliases and your parents hate you.',
        maybe_kick: 'Allows a user to kick another user with 1 in 10 odds. Will also kick the person requesting the kick with 1 in 20 odds. If you were the last person to request a maybe_kick, you will be akicked for 2mins and that only expires upon bot restart or !reload',
        ascii: 'Stop being a weeb.',
        slap: 'Allows you to slap another user. Super cool, involves dead fish. This is timeshifter\'s 2nd greatest accomplishment, after his javascript gaytracer and before his .net haytracer.',
        unban: 'Clears all bans in the channel. Does not apply to akicks because thats not how IRC works, but hey keep tryin tora. Maybe it will suddenly work.',
        invite: 'Sends an /invite to a given list of user(s. Does not apply to people in the channel already, or timeshifter.',
        rekt: 'The best possible way to let someone know you think they got burned or otherwise were insulted or something. Go ahead, let them know.',
        tell: 'I can try to let someone know something once they return or I am restarted/reloaded, whichever comes first. It\'s like a PM but worse and you might get aids. Usage: !tell MikeWazowski your bot is broken, AGAIN.',
        seen: 'The last time I saw a given set of nicks. Usage: !seen yourmom atthe bar',
        help: 'A function which allows you to set these help messages. Crowdsourcing, made fun!',
        exec: 'Executes arbitrary code from you with root privs via a kubernetes thinger. Usage: !exec 1+1;drop table weeb_bot.',
        ladies: 'bitches be trifflin',
        oppls: '1 in 10 chance of being given op. 9 in 10 chance of being akicked for two mins. 100% chance that you read gay harry potter fanfic.',
        pride: 'Stick your tongue out and taste my rainbow.'
    };
    console.log(man_topics);
    var func = message.split(' ')[1];
    console.log(func);
    if( func !== undefined ){
      if( man_topics[func] !== undefined ){
        this.stream.say(chan, man_topics[func]);
      }else{
        this.stream.say(chan, 'dunno');
      }
    }else{
      var keys = Object.keys(man_topics).join(', ');
      console.log(keys);
      this.stream.say(chan, 'I can offer you info on the following: ' + keys);
    }
  },
  insult: function(chan, message, from){
    return;
    var insult = this.insults.get(this, chan, message, from);
  },
  echo: function(chan, message, from){
    return;
    this.insults.get();
    this.stream.say(chan, message + ' (' + from + ' is such a ' + this.insults.current_insult + ')');
  }
};

RegExp.escape= function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};
