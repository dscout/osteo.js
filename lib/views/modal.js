Osteo.ModalView = Osteo.View.extend({
  className:    "modal-view js-osteo-modal",
  rootSelector: "body",

  events: {
    "click .js-cancel" : "cancel",
  },

  display: function(options) {
    if (!options) options = {};

    this.collection = options.collection;
    this.context    = options.context;
    this.model      = options.model;

    this.render();
    this.open();

    return this;
  },

  open: function() {
    this.appendBody();
  },

  cancel: function() {
    this.hide();

    return false;
  },

  appendBody: function() {
    this.$el.appendTo(this.rootSelector).removeClass("hide");
  }
});
