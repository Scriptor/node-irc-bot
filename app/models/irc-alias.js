module.exports = function(db) {
  return db.define("irc_alias", {
    nick        : String,
    created_at  : Date
  }, {
    methods: {
    },

    hooks: {
      beforeValidation: function(next) {
        this.created_at = Date.now();
        next();
      }
    },

    validations: {
      //age: orm.enforce.ranges.number(18, undefined, "under-age")
    }
  });
};
