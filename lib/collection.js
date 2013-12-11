(function() {
  Osteo.Collection = Backbone.Collection.extend({
    toPresenters: function(presenter) {
      if (!presenter) presenter = Osteo.Presenter;

      return this.map(function(model) {
        return new presenter(model);
      });
    }
  });
})();
