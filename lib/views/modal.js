Osteo.ModalView = Osteo.View.extend({
  className:      "modal-view js-osteo-modal",
  rootSelector:   "body",
  screenTemplate: "<div class='modal-screen js-osteo-screen'></div>",

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
    this.appendScreen();
  },

  cancel: function() {
    this.hide();
    this.hideScreen();

    return false;
  },

  hideScreen: function() {
    if (this.$screen) {
      this.$screen.addClass("hide");
    }
  },

  appendBody: function() {
    this.$el.appendTo(this.rootSelector).removeClass("hide");
  },

  appendScreen: function() {
    if (!this.$screen) {
      this.$screen = $(this.screenTemplate);
    }

    this.$screen
      .appendTo(this.rootSelector)
      .off("click.osteo")
      .on("click.osteo", this.cancel)
      .removeClass("hide");
  }
});
