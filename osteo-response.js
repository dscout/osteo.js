var merge = require('./lib/merge');

var Response = function(request) {
  this.request = request;
  this.xhr     = this.request.xhr;
  this.text    = this.xhr.responseText;
  this.body    = JSON.parse(this.text);
  this.header  = this.parseHeader(this.xhr.getAllResponseHeaders());
  this.status  = this.xhr.status;
};

merge(Response.prototype, {
  parseHeader: function(string) {
    var lines  = string.split(/\r?\n/);
    var fields = {};
    var index, line, field, value;

    lines.pop(); // trailing CRLF

    for (var i = 0, len = lines.length; i < len; ++i) {
      line  = lines[i];
      index = line.indexOf(':');
      field = line.slice(0, index).toLowerCase();
      value = line.slice(index + 1).trim();
      fields[field] = value;
    }

    return fields;
  }
});

module.exports = Response;
