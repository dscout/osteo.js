Osteo.Collection = Backbone.Collection.extend({
  model: Osteo.Model,

  constructor: function(models, options) {
    options = options || {};

    if (options.root) this.root = options.root;

    Backbone.Collection.prototype.constructor.apply(this, arguments);
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

  toPresenters: function(presenter) {
    if (!presenter) presenter = Osteo.Presenter;

    return this.map(function(model) {
      return new presenter(model);
    });
  },

  set: function(models, options) {
    options = _.defaults({}, options, { parse: true });

    var results = Backbone.Collection.prototype.set.call(this, models, options);

    if (this.root) this._rootModels(this.root, results);

    return results;
  },

  associateRelations: function(response, root) {
    return Osteo.Sideload.associate(response, root);
  },

  _prepareModel: function(attrs, options) {
    var result = Backbone.Collection.prototype._prepareModel.call(this, attrs, options);

    if (this.root && result) this._rootModels(this.root, [result]);

    return result;
  },

  _rootModels: function(root, models) {
    var singular = Osteo.Sideload.singularize(root);

    _.each((_.isArray(models) ? models : [models]), function(model) {
      model.root = singular;
    });
  }
});
