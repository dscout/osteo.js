Osteo.Route = function() {
};

Osteo.Route.instance = function() {
  if (!this._instance) {
    this._instance = new this();
  }

  return this._instance;
};

Osteo.Route.prototype = {
  load: function() {
    return this;
  },

  unload: function() {
    return this;
  }
};
