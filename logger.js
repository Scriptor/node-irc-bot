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
    console.log("in find of logger proto");
    var contents = this.fs.readFileSync(filename, "utf8");
    console.log(contents);
    this.stream.say(key);
  }
}

module.exports = Logger;