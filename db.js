var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('angrywombot.db');

module.exports = {
    find_alias: function(chan, alias, from, bot){
        db.serialize(function(){
            try{
                console.log("Trying to find alias " + alias + " in channel " + chan);
                db.each('select * from channel_alias where channel = ? and key = ? order by id desc limit 1', [chan, alias], function( err, row ){
                    if( err !== null ){
                        console.log("sqlite3 error:");
                        console.log(err);
                        return;
                    }
                    console.log(row);
                bot.stream.say(chan, row.val);
                });
            }catch(err){
                console.log('db find_alias err: ', err);
            }
        });
    },
    add_alias: function(chan, author, key, val, bot){
        db.serialize(function(){
            console.log('Adding alias "' + key + '" in channel "' + chan + '" for user "' + author + '" with value "' + val + '"' );
            db.run('insert into channel_alias (channel, author, key, val) values (?, ?, ?, ?)', [chan, author, key, val], function(err){
            if( err !== null ){
                console.log(err);
            }else{
                // bot.stream.say(chan, author + ': alias added');
                bot.stream.say('Added alias "' + key + '" in channel "' + chan + '" for user "' + author + '" with value "' + val + '"' );
                
            }
          });
        }); 
    }
}

// test.find_alias('##webdevvit', 'zen');

// db.close();