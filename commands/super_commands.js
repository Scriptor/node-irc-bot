module.exports = {

  kill: function(chan, message) {
    this.stream.say(chan, 'Goodbye all');
    process.exit();
  },
  invite: function(chan, message) {
    var invitees = message.split(" ");
    for( i = 1; i < invitees.length; i++ ){
      console.log("Inviting user " + invitees[i]);
      this.stream.send("INVITE", invitees[i], chan);
    }
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
  }
};
