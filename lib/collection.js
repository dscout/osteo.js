(function() {
  Osteo.Collection = Backbone.Collection.extend({
    initialize: function(_models, options) {
      if (!options) options = {};

      this.root = options.root;
    },

    parse: function(response) {
      if (this.root) {
        return response[this.root];
      } else {
        return response;
      }
    },

    toPresenters: function(presenter) {
      if (!presenter) presenter = Osteo.Presenter;

      return this.map(function(model) {
        return new presenter(model);
      });
    }
  });
})();
