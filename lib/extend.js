var merge = require('./merge');

var extend = function(protoProps) {
  var parent = this;
  var child, surrogate;

  child = function() { return parent.apply(this, arguments); };

  merge(child, parent);

  surrogate = function () { this.constructor = child; };
  surrogate.prototype = parent.prototype;
  child.prototype     = new surrogate();

  if (protoProps) {
    merge(child.prototype, protoProps);
  }

  return child;
}

module.exports = extend;
