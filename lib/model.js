Osteo.Model = Backbone.Model.extend({
  defaultAutoSaveDelay: 500,

  relations: {},

  constructor: function(attributes) {
    this.attachRelations(attributes);

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
  },

  attachRelations: function(attributes) {
    var relations = this.relations,
        data, collection;

    if (_.isFunction(relations)) relations = relations();

    for (var rel in relations) {
      data = attributes[rel];
      collection = relations[rel];

      this[rel] = new collection(data);

      delete attributes[rel];
    }

    return attributes;
  }
});
