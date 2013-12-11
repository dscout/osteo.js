(function() {
  Osteo.I18n = {
    pattern: /%\{(.+?)\}/g,

    lookup: function(path, options) {
      var buff = _.reduce(path.split("."), function(trans, key) {
        return trans[key];
      }, Osteo.TRANSLATIONS);

      return buff.replace(Osteo.I18n.pattern, function(match, capture) {
        return options[capture];
      });
    }
  };
})();
