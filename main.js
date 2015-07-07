var irc = require('irc');

var Bot            = require('./bot.js');
var config         = require('./config.js');
var SuperCommands  = require('./commands/super_commands.js');
var AliasCommands  = require('./commands/alias_commands.js');
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
bot.load_command_block('normal', AliasCommands);

console.log(' -- Adding Listeners --');
client.addListener('registered', bot.authenticate.bind(bot));
client.addListener('message', bot.consumeMessage.bind(bot));
