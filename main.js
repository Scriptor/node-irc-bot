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

// console.log(' -- Logger --');
// var logger =

console.log(' -- Creating Bot Instance --');
var bot = new Bot(config.botName, config.botPass, config.alias_token, client);

// Populate our bot with da knowledge
bot.load_command_block('super', SuperCommands);
bot.load_command_block('normal', NormalCommands);
// bot.load_command_block('normal', AliasCommands);

console.log(' -- Adding Listeners --');
client.addListener('registered', bot.authenticate.bind(bot));
client.addListener('message', bot.consumeCommand.bind(bot));
client.addListener('error', function(message) {
    console.log('error: ', message);
});

/*** lots of bots
var numbots = 5;
var clients = [];
var bots = [];

for(var i=0; i<numbots; i++) {
  console.log(' -- Connecting to IRC --');
  clients[i] = new irc.Client(config.server, config.botName+i, options);

  console.log(' -- Creating Bot Instance --');
  bots[i] = new Bot(config.botName + i, config.botPass, config.alias_token, clients[i]);

  // Populate our bot with da knowledge
  bots[i].load_command_block('super', SuperCommands);
  bots[i].load_command_block('normal', NormalCommands);
  bots[i].load_command_block('normal', AliasCommands);

  console.log(' -- Adding Listeners --');
  clients[i].addListener('message', bots[i].consumeCommand.bind(bots[i]));
}
****/
