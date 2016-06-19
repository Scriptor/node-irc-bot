module.exports = function(db, models) {
  return db.define("message", {
    content      : String,
    created_at   : Date,
    chat_user_id : Number
  }, {
    methods: {
    },

    validations: {
      //age: orm.enforce.ranges.number(18, undefined, "under-age")
    }
  }).hasOne('chat_user', models['chat-user'], {reverse: 'messages'});
};
