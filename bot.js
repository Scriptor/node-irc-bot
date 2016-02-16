var IgnoredUsers = require('./ignored_users.js');
var SuperUsers = require('./super_users.js');
var Logger         = require('./logger.js');
var figlet = require('figlet');

var Bot = function(name, password, token, stream, http_sniffer, figlet) {
  this.name     = name;
  this.token    = token;
  this.stream   = stream;
  this.password = password;
  this.commands = {};
  this.previous_nick = '';
  this.logger   = new Logger({log_file:"lols.txt"}, this.stream);
  this.http_sniffer = http_sniffer;
  this.figlet = figlet;
};

// temp

Bot.prototype = {
 /* consumeMessage
  *
  * Feeds a message through the bot's engine
  * and streams the response back
  */
  consumeCommand: function(from, to, message) {
    // If you're ignored you can't do anything
    try{
/*        var from = from.trim();
        if( from == 'omfgtora' || from == 'gofsckyourself' ){
		console.log("killing tora");
                this.stream.send("KICK", to, from, "unlucky");
                return;
        }*/
      if(!IgnoredUsers.includes(from)) {

      var parts =  this._parse_command(message);

      // Do we have our command token?
      if(message.indexOf(this.token) === 0) {

        // Check if the command is in our commands object
        if(typeof this.commands[parts.name] === 'object') {
          var cmd = this.commands[parts.name];

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
        console.log("possible alias?");
         console.log(message);
        }
      } else {
          console.log("This isn't an alias or a command");
          if( message.indexOf("r/") == 0 ){
            console.log("Search/replace thing");
            // trying to do the search/replace thing
            this.commands.s.func.apply(this, [to, message, from, true]);

          }else if(message.indexOf("s/") == 0){
              console.log("Funny search/replace thing");
              this.commands.s.func.apply(this, [to, message, from, false]);
          }else if(message.indexOf("http") == 0){
            //this.http_sniffer.sniff(to, message, from);
          }else{
            // Log it (mainly for s/whatever/whatever operations)
            this.logger.write(from, to, message);
          }
        }
    }
    } catch( err ){
         console.log("Consumption error: ", err);
    }
    this.previous_nick = from;
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
          parts = param_string.split(',');

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
    console.log('Attempting Authentication');
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
    for(var name in commands) {

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

      this.commands[name] = {
        group: group,
        func:  commands[name]
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
