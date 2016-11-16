var EventBuss = require('../event-buss.js');

module.exports = Object.assign({}, EventBuss, {
  init(client) {
    console.log('USING THE CONSOLE STREAM');

    this.client = client;
    this.client.addListener('message', (to, from, message) => {
      console.log('MESSAGE FROM CLIENT');
      this.trigger('message', {
        nick: to,
        channel: from,
        message: message
      });
    });
  },

  say(channel, str) {
    console.log('Message: ' + str);
    this.client.say(channel, str);
  },

  inject(nick, channel, message) {
    console.log('-- INJECTED --');
    console.log('- nick: ' + nick);
    console.log('- channel: ' + channel);
    console.log('- message: ' + message);
    console.log('--------------');

    this.trigger('message', {nick: nick, channel: channel, message: message});
  }
});
