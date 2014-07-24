var extend = require('./lib/extend');
var merge  = require('./lib/merge');
var Events = require('./osteo-events');

var Model = function(attributes, options) {
  options = options || {};
  this.attributes = {}

  if (options.root) {
    this.root = options.root;
  }

  this.set(this.parse(attributes || {}));

  this.initialize.apply(this, arguments);
};

Model.extend = extend;

// url
// fetch
// save
// destroy

merge(Model.prototype, Events, {
  idAttribute: 'id',

  root: null,

  initialize: function() {
  },

  getId: function() {
    return this.attributes[this.idAttribute];
  },

  isNew: function() {
    return !this.getId();
  },

  get: function(key) {
    return this.attributes[key];
  },

  has: function(key) {
    var value = this.get(key);

    return value !== null && value !== undefined;
  },

  parse: function(response) {
    if (response && this.root && response[this.root]) {
      return response[this.root];
    } else {
      return response;
    }
  },

  dump: function() {
    var attributes = merge({}, this.attributes);
    var rooted     = {};

    if (this.root) {
      rooted[this.root] = attributes;
      return rooted;
    } else {
      return attributes;
    }
  },

  toJSON: function() {
    this.dump.apply(this, arguments);
  },

  set: function(key, value) {
    var attributes = {};
    var anyChanges = false;
    var currentVal;

    if (key == null) return this;

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

    if (attributes[this.idAttribute]) {
      this.id = attributes[this.idAttribute];
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
