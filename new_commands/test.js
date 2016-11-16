var EventBuss = require('../lib/event-buss.js');

module.exports = Object.assign({}, EventBuss, {
  match: /^test /,
  name: 'test',
  help: 'This thing does fun stuff',

  process(data) {
    console.log('FROM COMMAND');
    this.say(data.nick);
    this.say(data.message);
  }
});
