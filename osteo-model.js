var extend = require('./lib/extend');
var merge  = require('./lib/merge');
var Events = require('./osteo-events');

var Model = function(attributes, options) {
  this.attributes = attributes || {};

  this.initialize.apply(this, arguments);
};

Model.extend = extend;

// url
// fetch
// save
// destroy
// parse
// toJSON

merge(Model.prototype, Events, {
  idAttribute: 'id',

  initialize: function() {
  },

  getId: function() {
    return this.attributes[this.idAttribute];
  },

  isNew: function() {
    return !this.getId();
  },

  clone: function() {
    return new this.constructor(this.attributes);
  },

  get: function(key) {
    return this.attributes[key];
  },

  has: function(key) {
    var value = this.get(key);

    return value !== null && value !== undefined;
  },

  set: function(key, value) {
    var attributes = {};
    var anyChanges = false;
    var currentVal;

    if (key === Object(key)) {
      attributes = key;
    } else {
      attributes[key] = value;
    }

    for (var prop in attributes) {
      currentVal = this.attributes[prop];

      if (currentVal !== attributes[prop]) {
        anyChanges = true;

        this.attributes[prop] = attributes[prop];
        this.trigger('change:' + prop, this);
      }
    }

    if (anyChanges) {
      this.trigger('change', this);
    }

    return this;
  },

  unset: function(key, options) {
    if (this.has(key)) {
      delete this.attributes[key];

      this.trigger('change:' + key, this);
      this.trigger('change', this);
    }

    return this;
  },

  clear: function(options) {
    var overwritten = {};

    for (var key in this.attributes) {
      overwritten[key] = undefined;
    }

    return this.set(overwritten);
  }
});

module.exports = Model;
