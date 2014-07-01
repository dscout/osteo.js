var extend = require('./lib/extend');
var Events = require('./osteo-events');

var Model = function(attributes, options) {
  this.attributes = attributes || {};
}

Model.extend = extend;

// url
// fetch
// save
// destroy
// parse
// clone
// isNew
// clear
// unset
// has
// idAttribute
// getId

for (var prop in Events) {
  Model.prototype[prop] = Events[prop];
}

Model.prototype.get = function(key) {
  return this.attributes[key];
};

Model.prototype.set = function(key, value) {
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
};

module.exports = Model;
