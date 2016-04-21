var http = require('http');

module.exports ={
    sniff: function(chan, message, from){
        var url = message.search();
        var regex = new RegExp(/http*.\:\/\/.*\.([^\s]+)/);
        var title_regex = new RegExp(/(<\s*title[^>]*>(.+?)<\s*\/\s*title)>/gi);
        var results = regex.exec(message);
        if( results[0] !== null ){
            http.get({host: results[0], port: 80}, function(r){
                r.on('data', function(bit){
                    var result = bit.toString();
                    var match = title_regex.exec(result);
                    if( match && match[2] ) {
                        console.log(match[2]);
                    }
                })
            });
        }
    }
}
