module.exports = function(db) {
  return db.define("chat_user", {
    nick        : String,
    created_at  : Date,
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
