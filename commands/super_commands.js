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
      this.stream.send(chan, "MODE +i");
      this.stream.say("Invite-only mode has been turned on. Remember to /msg chanserv invite ##webdevvit if you get locked out.");
  },
  invites_off: function(chan, message){
      this.stream.send(chan, "MODE -i");
      this.stream.say("This channel is no longer in invite-only mode.");
  },
  timeout: function(chan, message){
      console.log("Trying to get everyone to stfu");
      this.stream.list(chan);
  },
  quiet: function(chan, message){
    var users = message.trim().split(' ');
    for( i in users ){
      this.stream.send("MODE", chan, "+q " + users[i]);
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

};
