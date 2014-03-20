Osteo.I18n = {
  pattern: /%\{(.+?)\}/g,

  lookup: function(path, options) {
    var hash = options ? (options.hash || options) : {};

    var buff = _.reduce(path.split("."), function(trans, key) {
      var match = trans[key];

      if (!match) {
        throw new Error("Unknown translation: " + path + ", " + key);
      } else {
        return trans[key];
      }
    }, Osteo.TRANSLATIONS);

    return buff.replace(Osteo.I18n.pattern, function(match, capture) {
      return hash[capture];
    });
  }
};
