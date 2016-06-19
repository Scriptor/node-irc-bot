module.exports = function(db, ChatUser) {
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
  }).hasOne('chat_user', ChatUser, {reverse: 'messages'});
};
