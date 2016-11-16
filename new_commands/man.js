var EventBuss = require('../lib/event-buss.js');

module.exports = Object.assign({}, EventBuss, {
  match: /^man/,
  name: 'man',
  help: 'Helps you find useful information on some useful commands!',

  process(data) {
    var command_name = data.message.replace(this.match, '').trim();

    if(command_name == '') {
      this.say('i can help you with...');
    } else {
      command = this.engine.commands.find((c) => c.name == command_name);

      if(command) {
        this.say(command.help);
      } else {
        this.say('Command not found... you suck');
      }
    }
  }
});
