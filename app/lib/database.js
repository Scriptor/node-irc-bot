var orm = require("orm");
var fs = require('fs');

var Database = function() {
  this.orm = orm;
};

Database.prototype = {
  connect(db_name) {
    if(typeof db_name === 'undefined') throw 'No database selected';

    return new Promise((resolve, reject) => {
      this.orm.connect('sqlite://db/' + db_name + '.db', (err, db) => {
        if(err) reject(err);

        this.modelSetup(db);

        db.sync((err) => {
          if(err) reject(err);
          resolve();
        });
      });
    });
  },

  modelSetup(db) {
    var files = fs.readdirSync('./app/models');

    var models = files.map(function(file) {
      return file.split('.')[0];
    });

    this.models = {};

    models.forEach((model_name) => {
      this.models[model_name] = require('../models/' + model_name + '.js')(db, this.models);
    });
  },

  findOrCreateBy(model, obj, cb) {
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
