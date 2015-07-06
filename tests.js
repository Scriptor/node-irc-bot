var monk = require('monk');
var db = monk('localhost:27017/angrywombot');
var aliases = db.get("aliases");

aliases.findOne({"alias": "test4"})
	.on('success', function(doc){console.log("success");})
	.on('fail', function(){console.log('error1')})
	.on('error', function(){console.log('error')})
	.on('complete', function(){console.log('donezo')})
	;
function error_handler()
{
	console.log("error");
}
console.log("end");

db.close();
process.exit();