var fs = require('fs');

var Logger = function(config, stream){
  this.config = config;
  this.stream = stream;
  this.fs = fs;
}

Logger.prototype = {
  write: function(from, to, message){
    var filename = this.config.log_file,
      timestamp = new Date(),
      log = from + ": " + message + "\n";
      this.fs.appendFile(filename, log);
  },
  find: function(key){
    var filename = this.config.log_file;
    var contents = this.fs.readFileSync(filename, "utf8");
		var regex = new RegExp(".*\\: " + key.trim() + ".*\\n");
		var match = contents.match(regex);
		return match;
		
		console.log("matched: " + match);
  }
}

module.exports = Logger;
