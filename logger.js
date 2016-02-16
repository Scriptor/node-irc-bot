var fs = require('fs');

var Logger = function(config, stream){
  this.config = config;
  this.stream = stream;
  this.fs = fs;
}

Logger.prototype = {
  write: function(from, to, message){
    var filename = "logs/" + to + ".txt",
      timestamp = new Date(),
      log = "<" + from + ">" + ": " + message + "\n";
      this.fs.appendFile(filename, log);
  },
  find: function(chan, key, log_lines){
    console.log("Trying to find '" + key + "' in logs..");
    var contents = this.fs.readFileSync("logs/" + chan + ".txt", "utf8").split("\n");
    var contents = contents.splice(contents.length - (log_lines + 1), log_lines);
  	var regex = new RegExp(".*\\: .*" + key.trim() + ".*");
    for( i = 0; i < log_lines; i++ ){
  		var match = contents[i].match(regex);
      if( match !== null ){
        return match[0];
      }
    }
  },
  search: function(chan, key, log_lines){
  var contents = this.fs.readFileSync("logs/" + chan + ".txt", "utf8").split("\n");
  var contents = contents.splice(contents.length - (log_lines + 1), log_lines);

  for( i = 0; i < log_lines; i++ ){
      if( contents[i].lastIndexOf(key) != -1 ){
          console.log(contents[i].lastIndexOf(key));
          return contents[i];
      }
  }
}
}

module.exports = Logger;
