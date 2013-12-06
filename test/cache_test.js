describe('Osteo.Cache', function() {
  var cache;

  beforeEach(function() {
    cache = new Osteo.Cache();
  });

  describe('#add', function() {
    it('caches the object by its cid', function() {
      var object = { cid: 'a1' }

      cache.add(object);

      expect(cache.get(object.cid)).to.eql(object);
    });

    it('caches the object by the model when present', function() {
      var object = { cid: 'a1', model: { cid: 'b1' } }

      cache.add(object);

      expect(cache.get('a1')).to.eql(object);
      expect(cache.get('b1')).to.eql(object);
    });
  });

  describe('#remove', function() {
    it('removes the cached object', function() {
      var object = { cid: 'a1', model: { cid: 'b1' } }

      cache.add(object);
      cache.remove(object);

      expect(cache.get('a1')).to.be.undefined
      expect(cache.get('b1')).to.be.undefined
    });
  });
});
