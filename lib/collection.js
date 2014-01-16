Osteo.Collection = Backbone.Collection.extend({
  model: Osteo.Model,

  initialize: function(_models, options) {
    options = options || {};

    if (options.root) this.root = options.root;

    if (options.model) {
      this.model = options.model;
    } else {
      this.model = Osteo.Model;
    }
  },

  parse: function(response) {
    if (response && this.root && response[this.root]) {
      this.associateRelations(response, this.root);
      return response[this.root];
    } else {
      return response;
    }
  },

  toJSON: function(options) {
    var object = {};

    var models = this.map(function(model) {
      return _.clone(model.attributes);
    });

    if (options && options.rooted) {
      object[this.root] = models;

      return object;
    } else {
      return models;
    }
  },

  set: function(models, options) {
    var results = Backbone.Collection.prototype.set.call(this, models, options),
        singular;

    if (this.root) {
      singular = Osteo.Sideload.singularize(this.root);

      _.each((_.isArray(results) ? results : [results]), function(model) {
        model.root = singular;
      });
    }

    return results;
  },

  toPresenters: function(presenter) {
    if (!presenter) presenter = Osteo.Presenter;

    return this.map(function(model) {
      return new presenter(model);
    });
  },

  associateRelations: function(response, root) {
    return Osteo.Sideload.associate(response, root);
  }
});
