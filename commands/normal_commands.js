module.exports = {
  test: function(chan, message) {
    this.stream.say(chan, 'Test command! - ' + message);
  },

  test_two: function(chan, message) {
    this.stream.say(chan, 'Test command 2! - ' + message);
  }
};
