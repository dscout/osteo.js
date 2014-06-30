var _      = require('underscore');
var extend = require('./lib/extend');

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

Model.extend = extend;

module.exports = Model;
