module.exports = {
  channels: ['#/r/webdev'],

  includes: function(chan) {
    return this.channels.indexOf(chan) !== -1;
  }
}
