(function() {
  Osteo.Presenter = function(model) {
    this.model = model;
    this.model.on("change", this.replicateChanged, this);

    this.duplicateAttributes();

  };

  Osteo.Presenter.prototype = {
    get: function(key) {
      return this.model.get(key);
    },

    duplicateAttributes: function() {
      var self = this;

      _.forOwn(this.model.attributes, function(value, key) {
        if (self[key] === undefined) {
          self[key] = value;
        }
      });
    },

    // for key of model.changed
    //   @[key] = model.get(key) unless _.isFunction(@[key])
    replicateChanged: function(model) {
      var self = this;

      _.forOwn(model.changed, function(_value, key) {
        if (!_.isFunction(self[key])) {
          self[key] = model.get(key);
        }
      });
    }
  };
})();
