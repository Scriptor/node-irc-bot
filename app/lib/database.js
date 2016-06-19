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
    models = ['chat-user', 'message'];

    this.models = {};

    models.forEach((model_name) => {
      this.models['chat-user'] = require('../models/chat-user.js')(db, this.models);
    });
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
