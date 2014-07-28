var extend = require('./lib/extend');
var merge  = require('./lib/merge');

var Router = function() {
};

Router.extend = extend;

merge(Router.prototype, {
  handle: function() {
    return 'handled'
  }
});

module.exports = Router
