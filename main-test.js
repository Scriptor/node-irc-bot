var BotEngine = require('./lib/bot-engine.js');
var stream = require('./lib/streams/console.js');

var engine = new BotEngine({
  stream: stream
});

engine.inject('Criten', '#webdevvit', 'testHowdy');
engine.inject('Criten', '#webdevvit', 'Howdy test');
engine.inject('Criten', '#webdevvit', 'test Howdy test');
engine.inject('Criten', '#webdevvit', 'test Howdy test');
engine.inject('Criten', '#webdevvit', 'test Howdy test');
engine.inject('Criten', '#webdevvit', 'test Howdy test');
engine.inject('Criten', '#webdevvit', 'test Howdy test');
