module.exports = function(db, models) {
  return db.define("irc_channel", {
    created_at : Date,
    name       : String
  }, {
    hooks: {
      beforeValidation: function(next) {
        this.created_at = Date.now();
        next();
      }
    },

    methods: {
    },

    validations: {
      //age: orm.enforce.ranges.number(18, undefined, "under-age")
    }
  });
};
