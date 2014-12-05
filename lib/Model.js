var extend       = require('./utils/extend');
var merge        = require('./utils/merge');
var mixin        = require('./utils/mixin');
var EventEmitter = require('events').EventEmitter;

var Model = function(attributes) {
  mixin(this);

  this.attributes = {};
  this.store      = null;

  this.set(attributes || {});
  this.initialize.apply(this, arguments);
};

Model.extend = extend;

merge(Model.prototype, EventEmitter.prototype, {
  idAttribute: 'id',

  mixins: [],

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

  dump: function() {
    return merge({}, this.attributes);
  },

  toJSON: function() {
    this.dump.apply(this, arguments);
  },

  set: function(key, value) {
    var attributes = {};
    var anyChanges = false;
    var currentVal;

    if (key === null) return this;

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
        this.emit('change:' + prop, this);
      }
    }

    if (attributes[this.idAttribute]) {
      this.id = attributes[this.idAttribute];
    }

    if (anyChanges) {
      this.emit('change', this);
    }

    return this;
  },

  unset: function(key, options) {
    if (this.has(key)) {
      delete this.attributes[key];

      this.emit('change:' + key, this);
      this.emit('change', this);
    }

    return this;
  },

  clear: function(options) {
    var overwritten = {};

    for (var key in this.attributes) {
      overwritten[key] = undefined;
    }

    return this.set(overwritten);
  },

  sync: function(verb) {
    Model.sync(verb, this);
  },

  fetch: function() {
    this.sync('read');
  },

  save: function(attributes) {
    this.set(attributes);

    var verb = this.isNew() ? 'create' : 'update';

    this.sync(verb);
  },

  destroy: function() {
    this.sync('delete');
  }
});

module.exports = Model;
