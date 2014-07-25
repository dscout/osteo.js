var expect     = require('chai').expect;
var sinon      = require('sinon');
var Collection = require('../osteo-collection');
var Model      = require('../osteo-model');

describe('Collection', function() {
  var Foo = Collection.extend({});

  describe('#root', function() {
    it('does not override without a root in options', function() {
      var Coll = Collection.extend({ root: 'posts' });
      var coll = new Coll();

      expect(coll.root).to.eq('posts');
    });
  });

  describe('#model', function() {
    it('defaults to the osteo model', function() {
      var foo = new Foo();

      expect(foo.model).to.eql(Model);
    });
  });

  describe('#models', function() {
    it('initializes to an empty array', function() {
      var foo = new Foo();

      expect(foo.models).to.eql([]);
    });

    it('vivifies passed attributes into models', function() {
      var foo = new Foo([{ id: 1 }, { id: 2 }]);

      expect(foo.models.length).to.eq(2);
    });
  });

  describe('#parse', function() {
    it('extracts data from the root key', function() {
      var foo     = new Foo([], { root: 'posts' });
      var payload = { posts: [{ id: 1 }, { id: 2 }] };

      expect(foo.parse(payload).length).to.eq(2);
    });

    it('falls back to the response without a root', function() {
      var foo     = new Foo([], { root: 'posts' });
      var payload = [{ id: 1 }, { id: 2 }];

      expect(foo.parse(payload)).to.eql(payload);
    });
  });

  describe('#dump', function() {
    it('flattens model attributes', function() {
      var models = [{ id: 1 }, { id: 2 }],
          foo    = new Foo(models, { root: 'posts' });

      expect(foo.dump()).to.eql(models);
    });

    it('flattens models into the root namespace', function() {
      var models = [{ id: 1 }, { id: 2 }],
          foo    = new Foo(models, { root: 'posts' });

      expect(foo.dump({ rooted: true })).to.eql({ posts: models });
    });

    it('is aliased as toJSON', function() {
      var foo = new Foo([], { root: 'posts' });

      expect(foo.toJSON({ rooted: true })).to.eql(foo.dump({ rooted: true }));
    });
  });

  describe('#add', function() {
    it('vivifies attributes as models', function() {
      var foo = new Foo();

      var models = foo.add([{ id: 1 }, { id: 2 }]);

      expect(models.length).to.eq(2);
      expect(foo.models.length).to.eq(2);

      foo.add({ id: 3, name: 'gamma' });

      expect(foo.models.length).to.eq(3);
    });

    it('does not add a model with the same id multiple times', function() {
      var foo = new Foo();

      foo.add([{ id: 1 }, { id: 1 }]);

      expect(foo.models.length).to.eq(1);
    });

    it('stores existing models directly', function() {
      var foo   = new Foo();
      var model = new Model({ id: 1, name: 'alpha' });

      foo.add(model);

      expect(foo.models.length).to.eq(1);
      expect(foo.models[0].get('name')).to.eq('alpha');
    });

    it('associates models with the collection', function() {
      var foo   = new Foo();
      var model = new Model({ id: 1 });

      foo.add(model);

      expect(model.collection).to.eql(foo);
    });

    it('passes the singluar root through to models', function() {
      var foo    = new Foo([], { root: 'posts' });
      var models = foo.add({ posts: [{ id: 2 }, { id: 3 }]});

      expect(foo.models[0].root).to.eq('post');
      expect(foo.models[1].root).to.eq('post');
    });

    it('triggers an `add` event for each model', function() {
      var foo = new Foo();
      var spy = sinon.spy();

      foo.on('add', spy);

      foo.add([{ id: 1 }, { id: 2 }]);

      expect(spy.calledTwice).to.be.true;
    });
  });

  describe('#remove', function() {
    it('removes the model from the collection', function() {
      var foo   = new Foo([{ id: 100 }, { id: 101 }, { id: 102 }]);
      var model = foo.get(100);

      foo.remove(model);

      expect(foo.length).to.eq(2);
      expect(foo.models).not.to.include(model);
      expect(foo.get(100)).to.be.undefined;

      foo.remove([foo.get(101), foo.get(102)]);

      expect(foo.length).to.eq(0);
    });

    it('safely ignores models that are not in the colleciton', function() {
      var foo = new Foo();
      var model = new Model({ id: 100 });

      foo.remove(model);
    });

    it('triggers a remove event for each model', function() {
      var foo    = new Foo();
      var modelA = new Model({ id: 100 });
      var modelB = new Model({ id: 101 });
      var spyA   = sinon.spy();
      var spyB   = sinon.spy();

      modelA.on('remove', spyA);
      modelB.on('remove', spyB);

      foo.remove([modelA, modelB]);

      expect(spyA.calledWith(modelA, foo, {})).to.be.true;
      expect(spyB.calledWith(modelB, foo, {})).to.be.true;
    });
  });

  describe('#lookup', function() {
    it('returns existing models', function() {
      var collection = new Foo([{ id: 1, name: 'osteo' }]);

      expect(collection.lookup(1).get('name')).to.eq('osteo');
    });

    it('returns a new model instance without an existing model', function() {
      var collection = new Foo();

      var found = collection.lookup(1, { name: 'osteo' });

      expect(found.id).to.eq(1);
      expect(found.get('name')).to.eq('osteo');
      expect(found.collection).to.eql(collection);
      expect(collection.get(1)).not.to.be.undefined;
    });

    it('gracefully handles undefined attributes', function() {
      var collection = new Foo();

      expect(collection.lookup(1).id).to.eq(1);
    });
  });

  describe('#get', function() {
    it('retrieves models by id', function() {
      var foo   = new Foo([{ id: 1 }]);
      var model = foo.get(1);

      expect(model).not.to.be.undefined;
      expect(model.getId()).to.eq(1);
    });

    it('retrieves models by id attribute', function() {
      var Mode = Model.extend({ idAttribute: '_id' });
      var Coll = Collection.extend({
        model: Mode
      });

      var foo = new Coll({ _id: 1 });

      expect(foo.get(1)).not.to.be.undefined;
    });
  });

  describe('#at', function() {
    it('retrives a model by position', function() {
      var foo = new Foo([{ id: 100 }, { id: 200 }, { id: 300 }]);

      expect(foo.at(0).get('id')).to.eq(100);
      expect(foo.at(1).get('id')).to.eq(200);
      expect(foo.at(2).get('id')).to.eq(300);
      expect(foo.at(4)).to.be.undefined;
    });
  });

  describe('#length', function() {
    it('keeps a length property in sync', function() {
      var foo = new Foo();

      expect(foo.length).to.eq(0);

      foo.add({ id: 100 });

      expect(foo.length).to.eq(1);
    });
  });

  describe('#sort', function() {
    it('sorts models by the comparitor', function() {
      var foo = new Foo([{ id: 200 }, { id: 300 }, { id: 100 }]);

      foo.comparitor = function(a, b) {
        return a.get('id') - b.get('id');
      };

      foo.sort()

      var ids = foo.models.map(function(model) { return model.get('id') });

      expect(ids).to.eql([100, 200, 300]);
    });

    it('maintains a sort order when a comparitor is present', function() {
      var foo = new Foo([{ id: 200 }]);

      foo.comparitor = function(a, b) {
        return a.get('id') - b.get('id');
      };

      foo.add({ id: 100 });

      var ids = foo.models.map(function(model) { return model.get('id') });

      expect(ids).to.eql([100, 200]);
    });

    it('triggers a sort event when a comparitor is present', function() {
      var foo = new Foo();
      var spy = sinon.spy();

      foo.on('sort', spy);

      foo.sort();
      foo.comparitor = function() {};
      foo.sort();

      expect(spy.calledOnce).to.be.true;

      foo.sort({ silent: true });

      expect(spy.calledOnce).to.be.true;
    });
  });
});
