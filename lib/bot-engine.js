var BotEngine = function(config) {
  this.stream_client = config.stream_client;

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
        this.say(data.channel, 'running command: ' + command.name);

        command.say = function(msg) {
          this.say(data.channel, msg);
        }.bind(this);

        command.engine = this;
        command.process(data);
      }
    });
  },

  loadCommands() {
    this.commands = [];

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

    this.stream_init(this.stream_client);
    this.on('message', this.process);
  }
};

module.exports = BotEngine;
