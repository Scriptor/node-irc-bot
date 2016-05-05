var seent = function(){};

seent.prototype = {
    members: {},
    haveSeen: function(chan, nick){
        console.log('looking for members named ' + nick);
        console.log(this.members);
        try{
            if( this.members[chan][nick] !== undefined ){
                console.log('returning timestamp');
                return this.members[chan][nick];
            }else{
                return false;
            }
        } catch (e) {
            return false;
        }
    },
    saw: function(chan, nick){
        try{ 
            if( !(chan in this.members) ){
                this.members[chan] = {};
            }
            
            var now = new Date();
            var date = [now.getFullYear(), now.getMonth(), now.getDate()].join('-');
            var time = [now.getHours(), now.getMinutes(), now.getSeconds()].join(':');
            
            this.members[chan][nick] = date + '@' + time + ' UTC';
            console.log(['saw', nick, 'in', chan].join(' '));
        }catch(e){
            console.log('saw error');
            console.log(e);
        }
    }
};

module.exports = seent;