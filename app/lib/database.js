var orm = require("orm");

var Database = function() {
  
};

Database.prototype = {
  connect() {
    return new Promise((resolve, reject) => {
      orm.connect('sqlite://bot.db', (err, db) => {
        if(err) reject(err);

        this.setup(db);

        db.sync((err) => {
          if(err) reject(err);
          resolve();
        });
      });
    });
  },

  setup(db) {
    this.ChatUser = require('../models/chat-user.js')(db);
    this.Message = require('../models/message.js')(db);
  },

  findOrCreateBy: function(model, obj, cb) {
    model.find(obj, function(err, results) {
      if(err) throw err;

      if(results.length !== 0) {
        cb(results[0]);
      } else {
        model.create(obj, function(err, item) {
          if(err) throw err;

          cb(item);
        })
      }
    });
  }
};

module.exports = Database;
