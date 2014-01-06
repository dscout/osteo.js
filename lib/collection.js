Osteo.Collection = Backbone.Collection.extend({
  initialize: function(_models, options) {
    options = options || {};

    if (options.root) this.root = options.root;
  },

  parse: function(response) {
    if (this.root) {
      this.associateRelations(response, this.root);
      return response[this.root];
    } else {
      return response;
    }
  },

  add: function() {
    var singular, results;

    results = Backbone.Collection.prototype.add.apply(this, arguments);

    if (this.root) {
      singular = Osteo.Sideload.singularize(this.root);
      this.each(function(model) { model.root = singular; });
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
