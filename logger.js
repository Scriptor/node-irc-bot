var fs = require('fs');

var Logger = function(config, stream){
  this.config = config;
  this.stream = stream;
  this.fs = fs;
  this.srs_log = {};
}

Logger.prototype = {
  write: function(from, to, message){
    //console.log('write logs');
    var filename = "logs/" + to.replace(/\//g, '_') + ".txt",
      timestamp = new Date(),
      log = "<" + from + ">" + ": " + message + "\n";
      
      // Handle the log file
      this.fs.appendFile(filename, log);
      
      // Update the in-memory log
      this.srsly_log(to, log);
  },
  srsly_log: function(chan, log){
    console.log('srs logging');
    var chan = chan.replace('#', 'chan_').replace(/\//g, '_');
    if( this.srs_log[chan] === undefined ){
      // Create in memory log for this channel
      //console.log("Creating new memory log for this channel " + chan);
      this.srs_log[chan] = new Array;
    }else{
      if( this.srs_log[chan].length > 19 ){
        // Keep the log small, last 20 entries
        //console.log("Trimming log for channel " + chan);
        this.srs_log[chan].shift();
      }
    }
    
    // Log it
    //console.log("Adding memory log '" + log + " to " + chan);
    this.srs_log[chan].push(log);
  },
  fun_search: function(chan, key, log_lines){
    //console.log("Trying to find '" + key + "' in logs..");
    var contents = this.fs.readFileSync("logs/" + chan.replace(/\//g, '_') + ".txt", "utf8").split("\n");
    var contents = contents.splice(contents.length - (log_lines + 1), log_lines);
  	var regex = new RegExp(".*\\: .*" + key.trim() + ".*");
    for( var i = 0; i < log_lines; i++ ){
  		var match = contents[i].match(regex);
      if( match !== null ){
        return match[0];
      }
    }
  },
  srs_search: function(chan, key, log_lines){
    chan = chan.replace('#', 'chan_').replace(/\//g, '_');
    console.log("Trying to do some srs searching in " + chan);
    var log = this.srs_log[chan].slice().reverse();
    //console.log(log);
    for( var i in log ){
      //console.log('Checking for match in ' + log[i]);
      if( log[i].indexOf(key) > 0 ){
        // found a match
        //console.log("Returning match from srs_search");
        return log[i];
      }
    }
  }
}

module.exports = Logger;
