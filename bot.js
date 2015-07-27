var IgnoredUsers = require('./ignored_users.js');
var SuperUsers = require('./super_users.js');
var Logger         = require('./logger.js');

var Bot = function(name, password, token, stream) {
  this.name     = name;
  this.token    = token;
  this.stream   = stream;
  this.password = password;
  this.commands = {};
  this.previous_nick = '';
  this.logger   = new Logger({log_file:"lols.txt"}, this.stream);
};

Bot.prototype = {
 /* consumeMessage
  *
  * Feeds a message through the bot's engine
  * and streams the response back
  */
  consumeCommand: function(from, to, message) {
    // If you're ignored you can't do anything
    if(!IgnoredUsers.includes(from)) {

      // Do we have our command token?
      if(message.indexOf(this.token) === 0) {
        var parts =  this._parse_command(message);

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
            this.stream.say(to, 'You\'re too useless to do that!');
          }

        }
      } else {
          // Log it (mainly for s/whatever/whatever operations)
          this.logger.write(from, to, message);
        }
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

          string = string.replace(template_element, parts[parseInt(var_name)].trim());
        }
      }
    }

    // Output processed template
    this.stream.say(channel, string);
  },

 /* authenticate
  *
  * Attempts to authenticate our bot's user account
  * with the stream.
  */
  authenticate: function() {
    // Auth bot
    console.log('Attempting Authentication');
    this.stream.say('NICKSERV', 'identify ' + this.password);
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
  load_command_block: function(group, commands) {
    for(var name in commands) {
      // skip if it's a duplicate
      if(typeof this.commands[name] !== 'undefined') {
        console.log(name + ' IS ALREADY DEFINED!');
        continue;
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
