console.log("Bot starting");

var irc = require("irc");
// var c = require("irc-colors");
// var mongo = require('mongodb');
// var monk = require('monk');
// var db = monk('localhost:27017/nodetest1');
var responses = require('./responses.js');
var nickserv = require('./nickserv.js');
var chanserv = require('./chanserv.js');
var ignored_users = require('./ignored_users.js');
var super_users = require('./super_users.js');
var bot_commands = require('./bot_commands.js');
var config = require('./config.js');

console.log("Connecting to " + config.server);
try{
	var bot = new irc.Client(config.server, config.botName, {
		channels: config.channels
	});
} catch (e) {
	console.log("Exception found");
	console.log(e);
}

console.log("Adding listeners");
bot.addListener("message", function(from, to, text, message){
	var parts = message.args[1].split(" "),
		new_message = [],
		colors = ["red", "orange", "yellow", "green", "blue", "purple"],
		key = parts[0].replace(config.alias_token, ""),
		scope_helper = {
			bot: bot, 
			config: config,
			chanserv: chanserv,
			nickserv: nickserv,
			process: process,
			message: message,
			from: from,
			to: to,
			text: text,
			key: key
		};

	console.log('--');
	console.log("Message received:");
	console.log(from, to, text, message);
	console.log('--');

	// Auto auth if needed
	if( nickserv.has_authed === false ){
		console.log("Attempting auto auth..");
		bot_commands.auth(scope_helper);
	}


	// Deal with IRC services if needed
	if( from == "nickserv" ){
		console.log("Found a message from nickserv, processing");
		return nickserv.handle({"from": from, "to": to, "text": text, "message": message});
	}else if( from == "chanserv" ){
		console.log("Found a message from chanserv, processing");
		return chanserv.handle({"from": from, "to": to, "text": text, "message": message});
	}

	if( ignored_users.is(from) === false ){
		console.log("This user is not ignored..");
		// @TODO timebot echo here -- write module


		// Figure out the token situation
		if( config.alias_token.length > 1 ){
			console.log("token length > 1; " + config.alias_token);
			token_string = '';
			for( i = 0; i < config.alias_token.length; i++ ){
				token_string = token_string + parts[0].charAt(i);
			}

			console.log(token_string);
			possible_token = token_string;
		}else{
			var possible_token = parts[0].charAt(0);
		}
		console.log("Possible token determined to be " + possible_token);

		// Handle commands, aliases, etc
		console.log("Checking if possible_token is legit: " + possible_token + "; real is " + config.alias_token );
		if( possible_token == config.alias_token ){
			console.log("Command found");

			// Bot commands for bot admins
			try{
				if( (bot_commands[key] !== undefined) && ( typeof bot_commands[key] == "function" ) )
				{
					console.log("Looks like " + key + " is a bot command");
					return bot_commands[key](scope_helper);
				}
			} catch( TypeError ){
				console.log(TypeError);
				console.log("This is not a bot_command");
			}

			// Alias responses
			console.log("Checking if '" + key + "' in responses..");

			response = responses.get(key);
			console.log("Response returned: ", response);
			try{
				if( response !== null ){
					console.log("Trying to say this shit..");
					bot.say(message.args[0], response);
				}

			} catch (e) {
				console.log(e);
			}
		}
	}
});

console.log("listening done bitch");