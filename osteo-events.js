var _ = require('underscore');

var Events = {
  on: function(name, callback, context) {
    this._events = (this._events || {});
    var events = this._events[name] || (this._events[name] = []);

    events.push({ callback: callback, context: context || this });

    return this;
  },

  off: function(name, callback, context) {
    var events = this._events[name];

    if (!callback && !context) {
      delete this._events[name];
    }

    this._events[name] = _.select(events, function(event) {
      return callback && callback !== event.callback ||
             context  && context  !== event.context;
    });

    return this;
  },

  trigger: function(name) {
    if (!this._events) return this;

    var args   = [].slice.call(arguments, 1);
    var events = this._events[name];

    if (events) {
      _.each(events, function(event) {
        event.callback.apply(event.context, args);
      });
    }

    return this;
  }
}

module.exports = Events;
