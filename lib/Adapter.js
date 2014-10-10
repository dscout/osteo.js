var merge = require('./utils/merge');
var Request = require('proquest').Request;

var Adapter = function(options) {
  options = options || {}
  this.request = options.request || Request;
};

merge(Adapter.prototype, {
  lookup: {
    'create' : 'POST',
    'delete' : 'DELETE',
    'read'   : 'GET',
    'update' : 'UPDATE'
  },

  sync: function(verb, model) {
    var method  = this.lookup[verb];
    var url     = model.url();
    var request = new this.request(method, url);

    if (verb === 'create' || verb === 'update') {
      request.send(model.dump());
    }

    return request.end();
  }
});

module.exports = Adapter;
