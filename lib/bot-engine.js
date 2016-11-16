var BotEngine = function(config) {
  this.loadCommands();
  this._implementStream(config.stream);
};

BotEngine.prototype = {
  token: '%',
  commands: [],

  process(data) {
    // if user not ignored
    // if channel not ignored

    this.commands.forEach((command) => {
      if(data.message.match(command.match) !== null) {
        this.say('running command: ' + command.name);

        command.say = this.say;
        command.process(data);
      }
    });
  },

  loadCommands() {
    require("fs").readdirSync(__dirname + '/../new_commands').forEach((file) => {
      this.commands.push(require('../new_commands/' + file));
    });
  },

  _implementStream(stream) {
    for(key in stream) {
      if(key == 'init') {
        this['stream_init'] = stream[key];
      } else {
        this[key] = stream[key];
      }
    }

    this.stream_init();
    this.on('message', this.process);
  }
};

module.exports = BotEngine;
