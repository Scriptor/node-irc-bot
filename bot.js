var IgnoredUsers = require('./ignored_users.js');
var SuperUsers   = require('./super_users.js');
var Logger       = require('./logger.js');
var williamTell  = require('./commands/william_tell.js');
var seent  = require('./commands/seent.js');
require('./db.js');



var Bot = function(name, password, token, stream, db, colors) {
  this.name     = name;
  this.token    = token;
  this.stream   = stream;
  this.password = password;
  this.commands = {};
  this.previous_nick = '';
  this.logger   = new Logger({log_file:"lols.txt"}, this.stream);
  this.figlet = null;
  var sqlite3 = require('sqlite3').verbose();
  var db = new sqlite3.Database('angrywombot.db');
  this.db = db;
  this.colors = colors;
  this.williamTell = new williamTell();
  this.seent = new seent();

};

// temp

Bot.prototype = {
  timeout_active: false,
 /* consumeMessage
  *
  * Feeds a message through the bot's engine
  * and streams the response back
  */
  consumeCommand: function(from, to, message) {
    // If you're ignored you can't do anything
    try{
      
      this.williamTell.findTell(to, from, this);
      this.seent.saw(to, from);
      
      if(!IgnoredUsers.includes(from)) {

      var parts =  this._parse_command(message);

      // Do we have our command token?
      if(message.indexOf(this.token) === 0) {
        console.log(this.commands);

        // Check if the command is in our commands object
        if(typeof this.commands[parts.name] === 'object') {
          console.log("Checking for command");
          var cmd = this.commands[parts.name];
          console.log(cmd);

          // Check if the user has permission to run the command
          if(this['user_can_' + cmd.group](from)) {
            switch(typeof cmd.func) {
              case 'function':
                cmd.func.apply(this, [to, parts.params, from]);
              break;
              case 'string':
                this.processAlias(to, from, cmd.func, parts.params);
              break;
            }
          } else {
            this.stream.say(to, 'Lol nah, try sudo or something.');
          }
        }else{
          console.log("Trying DB aliases");
          this.commands.find.func(to, message, from, this);
        }
      } else {
          console.log("This isn't an alias or a command");
          if( message.indexOf("r/") == 0 ){
            // trying to do the search/replace thing
            this.commands.s.func.apply(this, [to, message, from, false, false]);
          }else if(message.indexOf("s/") == 0){
            this.commands.s.func.apply(this, [to, message, from, true, false]);
          }else if(message.indexOf('t/') == 0){
            this.commands.s.func.apply(this, [to, message, from, true, true]);
          }else if(message.indexOf("http") == 0){
            //this.http_sniffer.sniff(to, message, from);
          }else{
            // Log it (mainly for s/whatever/whatever operations)
            this.logger.write(from, to, message);
          }
        }
    }else{
      console.log('User is on ignore: ' + from);
    }
    } catch( err ){
         console.log("Consumption error: ", err);
    }
    this.previous_nick = from;
  },
  processDbAlias: function(channel, from, string){
    this.commands.find.func(channel, string, from, this);
  },

 /* processAlias
  *
  * Processes a alias's template then spits out the processed
  * template over the stream.
  */
  processAlias: function(channel, from, string, param_string) {
    // Process the template
    var rx = /{([^}]+)}/g;

    var objects = string.match(rx);
    console.log(objects);

    if(objects !== null) {
      for(var i=0; i<objects.length; i++) {
        var template_element = objects[i];

        var var_name = template_element.slice(1, template_element.length-1);

        if(isNaN(var_name)) {
          switch(var_name) {
            case 'prev':
              string = string.replace(template_element, this.previous_nick);
            break;
            case 'user':
              string = string.replace(template_element, from);
            break;
          }
        } else {
          var parts = param_string.split(',');

          try{
              string = string.replace(template_element, parts[parseInt(var_name)].trim());
          } catch( e ) {
              console.log(e);
          }
        }
      }
    }

    // Output processed template
    if( string.substring(0, 3) == "/me" ){
        this.stream.action(channel, string.substring(3));
    }else{
        this.stream.say(channel, string);
    }
  },

 /* authenticate
  *
  * Attempts to authenticate our bot's user account
  * with the stream.
  */
  authenticate: function() {
    // Auth bot
    console.log(' -- Attempting Authentication --');
    if( typeof this.password !== 'undefined' ){
      this.stream.say('NICKSERV', 'identify ' + this.password);
    }
  },

 /* user_can_{group_name}
  *
  * Helper functions to check if a user can run under a given command group
  */
  user_can_normal: function(name) {
    return true;
  },

  user_can_super: function(name) {
    return SuperUsers.includes(name);
  },

 /* load_command_block
  *
  * Loads the command block into the correct grouping. This allows
  * us to dynamically load blocks of commands from command modules.
  */
  load_command_block: function(group, commands, reload) {
    console.log(' -- Loading Command Blocks for ' + group + ' --');
    for(var name in commands) {
      console.log("loading command " + name);
      // duplicate check
      if(typeof this.commands[name] !== 'undefined') {
        // if reload is undefined then we can check dupes
        if(typeof reload === 'undefined'){
          console.log(name + ' IS ALREADY DEFINED!');
          continue;
        }else{
          console.log('Reloading command ' + name);
        }
      }
      
      if( typeof commands[name] === 'object' ){
        // a whole module!
        // basically the alias module for now
        // We're assuming there is a wrapper function
        // within this object with the name of the module itself
        var func = commands[name][name];
        console.log(' - Submodule found for ' + name);
      }else{
        // console.log('Command block found for ' + name);
        var func = commands[name];
      }

      this.commands[name] = {
        group: group,
        func: func
      };
    }
  },

 /* _parse_command
  *
  * Returns an object that represents the two main parts of a command,
  * the name of the command and the param string.
  */
  _parse_command: function(string) {
    string = string.slice(this.token.length, string.length);

    var fs = string.indexOf(' ');

    return {
      name: (fs == -1 ? string : string.substr(0, fs)),
      params: string.substr(string.indexOf(' '), string.length)
    };
  }
};


module.exports = Bot;
