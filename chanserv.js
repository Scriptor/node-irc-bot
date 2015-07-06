module.exports = {
	handle: function(from, to, text, message){
		this.received_message(message);
	},
	received_message: function(message){
		bot.say("angrywombat", "Message from NICKSERV: " + message);
	},
	topic: function(scope_helper){
		console.log("Topic setter");
		var new_topic = scope_helper.text.split(" ")[1];
		console.log("new topic is ", new_topic);
		scope_helper.bot.say("CHANSERV", scope_helper.text);
	}
}