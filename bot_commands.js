module.exports = {
	die: function(scope_helper){
		this.kill_bot(scope_helper);
	},
	kill_bot: function(scope_helper){
		console.log("Trying to kill myself!");
		for( channel in scope_helper.config.channels ){
			var channel = scope_helper.config.channels[channel];
			console.log("Saying goodbye to " + channel)
			// scope_helper.bot.say(channel, "Goodbye cruel channel");
			scope_helper.bot.say(channel, "Fuck you all and goodbye.");
		}
		scope_helper.process.exit();
	},
	auth: function(scope_helper){
		try{
			console.log("auth called");
			console.log(scope_helper.nickserv);
			scope_helper.nickserv.auth(scope_helper);
		} catch ( TypeError ) {
			console.log("TypeError encountered -- is nickserv defined/scoped?");
			console.log(TypeError);
		}
	},
	set_token: function(scope_helper){
		console.log("Trying to set new command token");
		console.log(scope_helper.text);
		var new_token = scope_helper.text.split(" ")[1];
		scope_helper.config.alias_token = new_token;
		scope_helper.bot.say(scope_helper.message.args[0], "New command token set to " + new_token);
	},
	topic: function(scope_helper){
		console.log("Topic setter admin command");
		scope_helper.chanserv.topic(scope_helper);
	}
}