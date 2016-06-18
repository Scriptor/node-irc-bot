module.exports = function(db) {
  return db.define("message", {
    content     : String,
    created_at  : Date,
  }, {
    methods: {
    },

    validations: {
      //age: orm.enforce.ranges.number(18, undefined, "under-age")
    }
  });
};
