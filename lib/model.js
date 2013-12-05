(function() {
  Osteo.Model = Backbone.Model.extend({
    defaultAutoSaveDelay: 500,

    initialize: function() {
      this.autoSaveDelay = this.defaultAutoSaveDelay;
    },

    autoSave: function() {
      if (this.debouncedSave === undefined) {
        this.debouncedSave = _.debounce(this.save, this.autoSaveDelay);
      }

      this.debouncedSave();

      return true;
    }
  });
})(this);
