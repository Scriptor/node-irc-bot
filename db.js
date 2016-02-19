var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('angrywombot.db');

db.serialize(function(){
    db.each('select * from channel_alias', function(err, row){
        console.log(row);
        console.log(err);
    });
});

db.close();

test = {
    find_alias: function(chan, message, from){
        console.log("Trying to find alias in DB");
    }
}
