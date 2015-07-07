var irc = require('irc');

var Bot            = require('./bot.js');
var config         = require('./config.js');
var SuperCommands  =  require('./commands/super_commands.js');
var NormalCommands = require('./commands/normal_commands.js');

var options = {
  channels: config.channels
};

console.log(' -- Connecting to IRC --');
var client = new irc.Client(config.server, config.botName, options);

console.log(' -- Creating Bot Instance --');
var bot = new Bot(config.botName, config.botPass, config.alias_token, client);

// Populate our bot with da knowledge
bot.load_command_block('super', SuperCommands);
bot.load_command_block('normal', NormalCommands);

console.log(' -- Adding Listeners --');
client.addListener('registered', bot.authenticate.bind(bot));
client.addListener('message', bot.consumeMessage.bind(bot));





/*
      // Bot commands for bot admins
      try {
        if( (bot_commands[key] !== undefined) && ( typeof bot_commands[key] == 'function' ) )
        {
          console.log('Looks like ' + key + ' is a bot command');
          return bot_commands[key](scope_helper);
        }
      } catch( TypeError ) {
        console.log(TypeError);
        console.log('This is not a bot_command');
      }

      // Alias responses
      console.log('Checking if \'' + key + '\' in responses..');

      response = responses.get(key);
      console.log('Response returned: ', response);
      try {
        if(response !== null) {
          console.log('Trying to say this shit..');
          bot.say(message.args[0], response);
        }

      } catch(e) {
        console.log(e);
      }
    }
  }
});

console.log('listening done bitch');

*/
