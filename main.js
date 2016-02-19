var irc = require('irc');

var Bot            = require('./bot.js');
var config         = require('./config.js');
var SuperCommands  = require('./commands/super_commands.js');
var AliasCommands  = require('./commands/alias_commands.js');
var NormalCommands = require('./commands/normal_commands.js');
var sqlite3 = require('sqlite3').verbose();
var figlet = require('figlet');
var db = new sqlite3.Database('angrywombot.db');
var options = {
  channels: config.channels,
  autoRejoin: true
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
bot.load_command_block('normal', AliasCommands);

console.log(' -- Adding Listeners --');
client.addListener('registered', bot.authenticate.bind(bot));
client.addListener('message', bot.consumeCommand.bind(bot));
client.addListener('error', function(message) {
    console.log('DISGUSTING CHANSERV ERROR: ', message);
});
client.addListener('part', function(message){
    console.log(message);
    console.log('some shithead left!');
});
client.addListener('chanellist', function(message){
  console.log('chanellist');
  console.log(message);
});

client.addListener('channellist_start', function(message){
  console.log('channellist_start');
  console.log(message);
});

client.addListener('channellist_item', function(message){
  console.log('channellist_item');
  console.log(message);
});

client.addListener('invite', function(chan){
  bot.stream.send('JOIN', chan);
  bot.stream.say(chan, 'hey assholes thanks for inviting me here');
});

client.addListener('kick', function(chan, nick){
  bot.stream.say(chan, 'haha that fgt ' + nick + ' got kicked');
});

client.addListener('part', function(chan, nick){
  console.log('user part');
  bot.stream.say(chan, 'so long ' + nick + ' you insatiable fgt');
});

client.addListener('join', function(chan, nick){
  if( bot.name == nick ){
    bot.stream.say(chan, 'I AM HERE PLS CALM DOWN');
  }else{
    bot.stream.say(chan, 'welcome to ' + chan + ', ' + nick + ', pls dont be fggy'); 
  }
});

/*** lots of bots
var numbots = 10;
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
