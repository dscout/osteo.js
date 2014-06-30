var _ = require('underscore');

var extend = function() {
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

module.exports = extend;
