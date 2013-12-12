Osteo.Presenter = function(model) {
  this.model = model;
  this.model.on("change", this.replicate, this);

  this.replicate(model);
};

Osteo.Presenter.prototype = {
  get: function(key) {
    return this.model.get(key);
  },

  replicate: function(model) {
    var changed = _.isEmpty(model.changed) ? model.attributes : model.changed;

    for (var key in changed) {
      if (!_.isFunction(this[key])) this[key] = changed[key];
    }
  }
};
