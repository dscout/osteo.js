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
});
