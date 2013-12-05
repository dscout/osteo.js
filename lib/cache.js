(function() {
  var Cache = Osteo.Cache = function() {
    this.cidCache = {};
  };

  Cache.prototype.add = function(object) {
    if (object.model !== undefined) {
      this.cidCache[object.model.cid] = object;
    }

    this.cidCache[object.cid] = object;
  };

  Cache.prototype.get = function(cid) {
    return this.cidCache[cid];
  };

  Cache.prototype.remove = function(object) {
    if (object.model !== undefined) {
      delete(this.cidCache[object.model.cid]);
    }

    delete(this.cidCache[object.cid]);
  };
})();
