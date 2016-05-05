var db = require('./db.js');
console.log(db);
var irc = require('irc');

var Bot            = require('./bot.js');
var config         = require('./config.js');
var SuperCommands  = require('./commands/super_commands.js');
var AliasCommands  = require('./commands/alias_commands.js');
var NormalCommands = require('./commands/normal_commands.js');
var AliasModule    = require('./commands/alias.js');
var sqlite3        = require('sqlite3').verbose();
var Colors      = require('irc-colors');
var options = {
  channels: config.channels,
  autoRejoin: true
};


console.log(' -- Connecting to IRC --');
var client = new irc.Client(config.server, config.botName, options);

console.log(' -- Creating Bot Instance --');
var bot = new Bot(config.botName, config.botPass, config.alias_token, client, db, Colors);

// Populate our bot with da knowledge
bot.load_command_block('super', SuperCommands);
bot.load_command_block('normal', NormalCommands);
// bot.load_command_block('normal', AliasCommands);
bot.load_command_block('normal', AliasModule);

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
  bot.seent.saw(chan, nick);
});

client.addListener('part', function(chan, nick){
  console.log('user part');
  //bot.stream.say(chan, 'so long ' + nick + ' you insatiable fgt');
  bot.seent.saw(chan, nick);
});

client.addListener('join', function(chan, nick){
  if( bot.name != nick ){
    bot.seent.saw(chan, nick);
    bot.stream.whois(nick, function(data){
      try{
        if( data.account !== undefined && data.accountinfo !== undefined ){
//          bot.stream.say(chan, 'welcome to ' + chan + ', ' + nick + ', pls dont be fggy');
        }else{
          // bot.stream.send('MODE', chan, '+m ' + nick);
          bot.stream.say(chan, 'pls auth to nickserv, ' + nick);
        }
      } catch (err) {
        // error listener will handle
      }
    });
  }
});

client.addListener('names', function(chan, names){
    // names data struct is { nick: '', nick_2: ''}
    // (dont ask me)
    for( var nick in names ){
      bot.seent.saw(chan, nick);
    }
});

if( process.argv[2] !== undefined )
{
  // Subtract one because we're already running one up yonder
  var numbots = parseInt(process.argv[2]) - 1;
  var clients = [];
  var bots = [];

  for(var i=0; i<numbots; i++) {
    console.log(' -- Connecting to IRC --');
    clients[i] = new irc.Client(config.server, config.botName+i, options);

    console.log(' -- Creating Bot Instance --');
    bots[i] = new Bot(config.botName + i, config.botPass, config.alias_token, clients[i], db);

    // Populate our bot with da knowledge
    bots[i].load_command_block('super', SuperCommands);
    bots[i].load_command_block('normal', NormalCommands);
    bots[i].load_command_block('normal', AliasCommands);

    console.log(' -- Adding Listeners --');
    clients[i].addListener('message', bots[i].consumeCommand.bind(bots[i]));
  }
}
