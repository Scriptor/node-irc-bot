var orm = require("orm");

var Database = function() {
  this.orm = orm;
};

Database.prototype = {
  connect(db_name) {
    if(typeof db_name === 'undefined') throw 'No database selected';

    return new Promise((resolve, reject) => {
      this.orm.connect('sqlite://db/' + db_name + '.db', (err, db) => {
        if(err) reject(err);

        console.log('CALLING');
        this.modelSetup(db);

        db.sync((err) => {
          if(err) reject(err);
          resolve();
        });
      });
    });
  },

  modelSetup(db) {
    var models = ['chat-user', 'message'];

    this.models = {};

    models.forEach((model_name) => {
      this.models[model_name] = require('../models/' + model_name + '.js')(db, this.models);
    });
  },

  findOrCreateBy: function(model, obj, cb) {
    model = this.models[model];

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
