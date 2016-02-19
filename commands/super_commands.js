module.exports = {

  kill: function(chan, message) {
    this.stream.say(chan, 'Goodbnye all');
    process.exit();
  },
  reload: function(chan, message) {
    // Delete the command files from node's cache first
    delete require.cache[require.resolve('./alias_commands.js')];
    delete require.cache[require.resolve('./super_commands.js')];
    delete require.cache[require.resolve('./normal_commands.js')];

    // Reload the commands
    var AliasCommands  = require('./alias_commands.js');
    var SuperCommands  = require('./super_commands.js');
    var NormalCommands = require('./normal_commands.js');
    this.load_command_block('super', SuperCommands, true);
    this.load_command_block('normal', NormalCommands, true);
    this.load_command_block('normal', AliasCommands, true);
  },
  invites_on: function(chan, message){
      this.stream.send("MODE", chan, "+i");
      this.stream.say(chan, "Invite-only mode has been turned on. Remember to /msg chanserv invite " + chan + " if you get locked out.");
  },
  invites_off: function(chan, message){
      this.stream.send("MODE", chan, "-i");
      this.stream.say(chan, "This channel is no longer in invite-only mode.");
  },
  timeout: function(chan, message){
      console.log("Trying to get everyone to stfu");
      this.stream.list(chan);
  },
  quiet: function(chan, message){
    var users = message.trim().split(' ');
    for( var i in users ){
      this.stream.send("MODE", chan, "+m " + users[i]);
    }
  },
  mk_reset: function(chan, message){
   this.stream.kick_expiry = undefined;
   this.stream.last_kicker = 'timeshifter';
  },
  rename: function(chan, message, from) {
      var new_name = message.trim().split(' ');
      console.log('Renaming to ', message.trim());
      this.stream.send('NICK', new_name[0]);
  },
  users: function(chan, message){
    this.stream.list(chan);
  },
  whois: function(chan, message, from){
    var users = message.trim().split(' ');
    console.log('checking the following users');
    console.log(users);
    for( var i in users ){
      var that = this;
      that.stream.whois(users[i], function(message){
        try{
          if( message.account !== undefined && message.accountinfo !== undefined ){
            that.stream.say(chan, message.nick + ' is totes authed to chanserv');
          }else{
            that.stream.say(chan, message.nick + ' doesnt look authed to chanserv, kick that motherfucker!');
          }
        } catch (err) {
          console.log(err);
        }
      }); 
    }
    
  }

};
