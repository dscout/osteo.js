describe('Osteo.Collection', function() {
  describe('#mixins', function() {
    it('extends any mixed in objects', function() {
      var Mixin = {
        foo: function() { return 'foo' }
      }

      var Collection = Osteo.Collection.extend({
        mixins: [Mixin]
      });

      var collection = new Collection();

      expect(collection.foo()).to.eq('foo');
    });
  });

  describe('#lookup', function() {
    it('returns existing models', function() {
      var collection = new Osteo.Collection([{ id: 1, name: 'osteo' }]);

      expect(collection.lookup(1).get('name')).to.eq('osteo');
    });

    it('returns a new model instance without an existing model', function() {
      var collection = new Osteo.Collection([]);

      var found = collection.lookup(1, { name: 'osteo' });

      expect(found.id).to.eq(1);
      expect(found.get('name')).to.eq('osteo');
      expect(found.collection).to.eql(collection);
      expect(collection.get(1)).not.to.be.undefined;
    });

    it('gracefully handles undefined attributes', function() {
      var collection = new Osteo.Collection([]);

      expect(collection.lookup(1).id).to.eq(1);
    });
  });

  describe('#set', function() {
    it('correctly merges models with a root', function() {
      var payload    = [{ id: 1, name: 'a' }, { id: 2, name: 'b' }],
          collection = new Osteo.Collection(payload, { root: 'posts' });

      collection.set({ posts: [
        { id: 1, name: 'z' }, { id: 3, name: 'y' }
      ]}, { remove: false });

      expect(collection.pluck('name')).to.eql(['z', 'b', 'y'])
    });
  });

  describe('#create', function() {
    var LocalModel = Osteo.Model.extend({
      save: function() { return true; }
    });

    it('passes the root through to new models', function() {
      var coll = new Osteo.Collection([], {
        model: LocalModel,
        root: 'posts'
      });

      var model = coll.create({ id: 1 });

      expect(model.root).to.eq('post')
    });
  });

  describe('.root', function() {
    it('passes root options through to models', function() {
      var collection = new Osteo.Collection([], { root: 'posts' }),
          models = collection.set({ posts: [{ id: 2 }, { id: 3 }]}, { parse: true });

      expect(models[0].root).to.eq('post');
      expect(models[1].root).to.eq('post');
    });
  });
});
