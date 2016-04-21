module.exports = {
    alias: {
        alias: function(chan, alias_parts, from, bot){
          console.log('we\'re in the wrapper function');
          var parts = alias_parts.trim().split(' ');
          var method = parts[0];
          console.log('Trying to find method ' + method);
          console.log(this);
          if( typeof this.commands.alias.method === 'function' ){
              this.method.apply(this, alias_parts);
          }
        },
        find: function(chan, alias_parts, from, bot){
            try{
                var alias = alias_parts.replace('!', '').trim().split(' ');
                console.log("Trying to find alias " + alias + " in channel " + chan + " for user "+ from);
                bot.db.serialize(function(){
                    console.log("running query");
                    console.log('select * from channel_alias where channel = ? and key = ? order by id desc limit 1');
                    console.log(chan);
                    console.log(alias);
                    bot.db.all('select * from channel_alias where channel = ? and key = ? order by id desc limit 1', [chan, alias.toString()], function( err, row ){
                        if( err !== null ){
                            console.log("sqlite3 error:");
                            console.log(err);
                            return;
                        }
                        console.log("query run");
                        console.log(row[0]);
                        var msg = row[0].val;
                        msg.replace('{prev}', bot.previous_nick);
                        msg.replace('{user}', from);
                        if( msg.substring(0, 3) == '/me' || msg.indexOf('{me}') ){
                            // send this as an action instead
                            bot.stream.action(msg.replace('{me}', ''));
                        }
                        bot.stream.say(chan, row[0].val);
                    });
                });
            }catch(err){
                console.log('db find_alias err: ', err);
            }
        },
        add: function(chan, alias_parts, author, bot){
            console.log("alias add!");
            try{
                var parts = alias_parts.trim().split(' ');
                var key = parts[0];
                delete parts[0];
                var val = Array.prototype.join.call(parts, ' ').trim();
                console.log('Adding alias "' + key + '" in channel "' + chan + '" for user "' + author + '" with value "' + val + '"' );
                this.db.run('insert into channel_alias (channel, author, key, val) values (?, ?, ?, ?)', [chan, author, key, val], function(err){
                    if( err !== null ){
                        console.log("alias add error");
                        console.log(err);
                    }
                });    
            } catch (err) {
                console.log("alias add error");
                console.log(err);
            }
        },
        rm: function(chan, author, key, val, bot){
            
        }
    }
}