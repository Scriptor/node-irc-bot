module.exports = function(db, models) {
  return db.define("irc_message", {
    content      : String,
    created_at   : Date,
    irc_alias_id : Number,
    irc_channel_id : Number
  }, {
    methods: {
    },

    validations: {
      //age: orm.enforce.ranges.number(18, undefined, "under-age")
    }
  }).hasOne('irc_alias', models['irc-alias'], {reverse: 'irc_messages'})
    .hasOne('irc_channel', models['irc-channel'], {reverse: 'irc_messages'});
};
