module.exports = {
  _events: {},

  on(event_name, callback) {
    if(!this._populated(event_name)) this._events[event_name] = [];

    this._events[event_name].push(callback);
  },

  off(event_name, callback) {
    if(!this._populated(event_name)) return;

    if(callback) {
      var index = this._events[event_name].indexOf(callback);

      this._events[event_name].splice(index, 1);
    } else {
      this._events[event_name] = [];
    }
  },

  trigger(event_name, data) {
    if(!this._populated(event_name)) return;

    this._events[event_name].forEach((callback) => {
      callback.call(this, data);
    });
  },

  _populated(event_name) {
    return Array.isArray(this._events[event_name]);
  }
};
