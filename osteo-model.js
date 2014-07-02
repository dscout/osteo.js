var extend = require('./lib/extend');
var merge  = require('./lib/merge');
var Events = require('./osteo-events');

var Model = function(attributes, options) {
  this.attributes = attributes || {};

  this.initialize.apply(this, arguments);
}

Model.extend = extend;

// url
// fetch
// save
// destroy
// clear
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
    return this.getId() == null;
  },

  clone: function() {
    return new this.constructor(this.attributes);
  },

  get: function(key) {
    return this.attributes[key];
  },

  has: function(key) {
    return this.get(key) != null;
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

    for (var key in attributes) {
      currentVal = this.attributes[key];

      if (currentVal !== attributes[key]) {
        anyChanges = true

        this.attributes[key] = attributes[key];
        this.trigger('change:' + key, this);
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
  }
});

module.exports = Model;
