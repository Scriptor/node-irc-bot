var williamTell = function(){
    
};

williamTell.prototype = {
    messages: {},
    
    recordTell: function(chan, to, msg, from, colors){
        console.log('recording tell');
        console.log(chan, to, msg);
        try{
            if( !(chan in this.messages) ){
                this.messages[chan] = {};
            }
            
            if( !(to in this.messages[chan]) ){
                this.messages[chan][to] = new Array();
            }
            
            var now = new Date();
            var formattedMsg = [
                colors.bold(msg.trim()), 
                '(', 
                from,
                now.toDateString(),
                now.toTimeString(),
                ')'
            ].join(' ');
            this.messages[chan][to].push(formattedMsg);
            return true;
        }catch (e){
            console.log('recordTell error');
            console.log(e);
            return false;
        }
    },
    findTell: function(chan, nick, bot){
        try{
            if( this.messages[chan][nick] ){
                for( var i in this.messages[chan][nick] ){
                    bot.stream.say(chan, nick + ': ' + this.messages[chan][nick][i] );
                    delete this.messages[chan][nick][i];
                }
            }
        }catch(e){
            // ignore
        }
    }
};

module.exports = williamTell;