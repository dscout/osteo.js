Osteo.FormView = Osteo.View.extend({
  initialize: function(options) {
    if (!options) options = {};

    Osteo.View.prototype.initialize.call(this, options);

    if (options.selector) this.selector = options.selector;
  },

  $form: function() {
    var selector = this.selector || "form";

    return this.$(selector);
  },

  serialize: function() {
    var $form   = this.$form(),
        $inputs = $form.find("input, textarea");

    return _.reduce($inputs, function(params, elem) {
      var name  = elem.name,
          value = elem.value,
          outer;

      if (name.indexOf("[") > -1) {
        name.replace(/(\w+)\[(\w+)\]/, function(_match, out, inn) {
          outer = out;
          name  = inn;
        });

        if (!params[outer]) params[outer] = {};

        params[outer][name] = value;
      } else {
        params[name] = value;
      }

      return params;
    }, {});
  },
});
