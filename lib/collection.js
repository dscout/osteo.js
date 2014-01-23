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

  create: function(model, options) {
    options = options ? options : {};
    options = this._rootOptions(options);

    return Backbone.Collection.prototype.create.call(this, model, options);
  },

  set: function(models, options) {
    options = _.defaults({}, options, { parse: true });
    options = this._rootOptions(options);

    return Backbone.Collection.prototype.set.call(this, models, options);
  },

  associateRelations: function(response, root) {
    return Osteo.Sideload.associate(response, root);
  },

  _rootOptions: function(options) {
    if (this.root) {
      options.root = Osteo.Sideload.singularize(this.root);
    }

    return options;
  }
});
