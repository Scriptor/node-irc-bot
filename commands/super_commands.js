module.exports = {
  super_test: function(chan, message) {
    this.stream.say(chan, 'Super Test command! - ' + message);
  },

  super_test_two: function(chan, message) {
    this.stream.say(chan, 'Super Test command 2! - ' + message);
  }
};
