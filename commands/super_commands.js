module.exports = {

  kill: function(chan, message) {
    this.stream.say(chan, 'Goodbnye all -_.');
    process.exit();
  },
  reload: function(chan, message) {
    // Delete the command files from node's cache first
    delete require.cache[require.resolve('./alias_commands.js')];
    delete require.cache[require.resolve('./super_commands.js')];
    delete require.cache[require.resolve('./normal_commands.js')];
    delete require.cache[require.resolve('./alias.js')];
    delete require.cache[require.resolve('./../logger.js')];
    delete require.cache[require.resolve('./william_tell.js')];
    delete require.cache[require.resolve('./seent.js')];
    delete require.cache[require.resolve('./invites.js')];

    // Reload the commands
    var AliasCommands  = require('./alias_commands.js');
    var SuperCommands  = require('./super_commands.js');
    var NormalCommands = require('./normal_commands.js');
    var williamTell    = require('./william_tell.js');
    var seent          = require('./seent.js');
    var invites        = require('./invites.js');
    var AliasModule    = require('./alias.js');
    var Logger         = require('./../logger.js');

    this.load_command_block('super', SuperCommands, true);
    this.load_command_block('normal', NormalCommands, true);
    this.load_command_block('normal', AliasCommands, true);
    this.load_command_block('normal', AliasModule, true);

    this.logger      = new Logger({log_file:"lols.txt"}, this.stream);
    this.williamTell = new williamTell();
    this.seent = new seent();
    this.invites = new invites();

    this.stream.say(chan, 'k.');
  },
  mk_reset: function(chan, message){
   this.stream.kick_expiry = undefined;
   this.stream.last_kicker = 'timeshifter';
  },
  rename: function(chan, message, from) {
      var new_name = message.trim().split(' ');
      console.log('Renaming to ', message.trim());
      this.nick = new_name;
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
  },
  leave: function(chan, message, from){
    console.log('LEAVING CHANNEL ' + chan);
    this.stream.say(chan, 'ok fuck you guys then, bunch of timeshifters anyway');
    this.stream.send('PART', chan);
  },
  join: function(chan, message, from){
    console.log('join cmd');
    var chans = message.trim().split(' ');
    for( i in chans ){
        this.stream.say(chan, 'MY PEOPLE NEED ME IN ' + chans[i]);
        this.stream.send('JOIN', chans[i]);
    }
  },
  token: function(chan, message, from){
    var new_token = message.trim().split(' ')[0];
    if( this.token == new_token ){
      this.stream.say(chan, 'thats already my token, retard');
    }else{
      this.token = new_token;
      this.stream.say(chan, 'k. i\'ll use the token ' + this.colors.bold(this.token) + ' for the remainder of my uptime.');
    }
  }

};
