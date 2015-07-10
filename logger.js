module.exports = {
	write: function(message){
		var filename = this.config.log_file;
		fs.appendFile(filename, message+"\n");
	},
	find: function(key){
		var filename = this.config.log_file;
		fs.readFile(filename, function(err, data){
			if(err) throw err;
			console.log("Found key " + key + " in " + data);
			this.stream.say("Found a match");
		});
	}
}