(function() {
  Osteo.Model = Backbone.Model.extend({
    defaultAutoSaveDelay: 500,

    relations: {},

    constructor: function(attributes) {
      for (var rel in this.relations) {
        var data = attributes[rel],
            coll = this.relations[rel];

        this[rel] = new coll(data);

        delete attributes[rel];
      }

      Backbone.Model.apply(this, arguments);
    },

    initialize: function() {
      this.autoSaveDelay = this.defaultAutoSaveDelay;
    },

    autoSave: function() {
      if (!this.debouncedSave) {
        this.debouncedSave = _.debounce(this.save, this.autoSaveDelay);
      }

      this.debouncedSave();

      return true;
    }
  });
})();
