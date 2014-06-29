var _ = require('underscore');

var Model = function(attributes, options) {
  this.attributes = attributes || {};
}

_.extend(Model.prototype, {
  get: function(key) {
    return this.attributes[key];
  },

  set: function(key, value) {
    var attributes = {};

    if (_.isObject(key)) {
      attributes = key;
    } else {
      attributes[key] = value;
    }

    return _.extend(this.attributes, attributes);
  }
});

Model.extend = function() {
  var parent = this,
      child, surrogate;

  child = function () {
    return parent.apply(this, arguments);
  };

  _.extend(child, parent);

  surrogate = function () { this.constructor = child; };
  surrogate.prototype = parent.prototype;
  child.prototype     = new surrogate();

  return child;
}

module.exports = Model;
