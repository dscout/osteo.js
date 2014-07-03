var expect     = require('chai').expect;
var sinon      = require('sinon');
var Collection = require('../osteo-collection');
var Model      = require('../osteo-model');

describe('Collection', function() {
  var Foo = Collection.extend({});

  describe('#model', function() {
    it('defaults to the osteo model', function() {
      var foo = new Foo()

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

  describe('#add', function() {
    it('vivifies attributes as models', function() {
      var foo = new Foo();

      foo.add([{ id: 1 }, { id: 2 }]);

      expect(foo.models.length).to.eq(2);

      foo.add({ id: 3, name: 'gamma' });

      expect(foo.models.length).to.eq(3);
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

    it('triggers an `add` event for each model', function() {
      var foo = new Foo();
      var spy = sinon.spy();

      foo.on('add', spy);

      foo.add([{ id: 1 }, { id: 2 }]);

      expect(spy.calledTwice).to.be.true;
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
});
