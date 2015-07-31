module.exports = {
  super_test: function(chan, message) {
    this.stream.say(chan, 'Super Test command! - ' + message);
  },

  super_test_two: function(chan, message) {
    this.stream.say(chan, 'Super Test command 2! - ' + message);
  },

  kill: function(chan, message) {
    this.stream.say(chan, 'Goodbye all');
    process.exit();
  },

  invite: function(chan, message) {
    var invitees = message.split(" ");
    for( i = 1; i < invitees.length; i++ ){
      console.log("Inviting user " + invitees[i]);
      this.stream.send("INVITE", invitees[i], chan);
    }
  }
};
