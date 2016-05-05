var invites = function(){}

invites.prototype = {
    invite_log: {},
    recordInvite: function(chan, target){
        console.log('Recording inite for ' + target + ' in ' +chan);
        try{
            if( !(chan in this.invite_log) ){
                this.invite_log[chan] = {};
                console.log('added a chan entry');
            }
            
            console.log(this.invite_log);
            this.invite_log[chan][target] = new Date();
            console.log(this.invite_log);
            
        }catch(e){
            console.log('invite log error lol');
            console.log(e);
        }
        
    },
    findInvited: function(target){
        // Note: there could be a collision here if multiple people invite the 
        // same target in different channels at the same time
        // Should be pretty small tho - since this is async, if there's a lag
        // between the bot and chanserv, the message might get sent to the wrong
        // channel. oh well, this isn't nasa software.
        try{
            for( var chan in this.invite_log ){
                if( target in this.invite_log[chan] ){
                    var result = [chan, this.invite_log[chan][target]];
                    delete this.invite_log[chan][target];
                    return result;
                }
            }
        }catch(e){
            console.log('invite log error reloaded');
            console.log(e);
        }
    }
    
}

module.exports = invites;