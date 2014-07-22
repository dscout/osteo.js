var expect = require('chai').expect;
var sinon  = require('sinon');
var Model  = require('../osteo-model');

describe('Model', function() {
  var Foo = Model.extend({});

  describe('#initialize', function() {
    it('calls initialize immediately after construction', function() {
      sinon.spy(Foo.prototype, 'initialize');

      var attr = { id: 100 };
      var opts = { opt: true };
      var foo  = new Foo(attr, opts);

      expect(foo.initialize.calledOnce).to.be.true;
      expect(foo.initialize.calledWith(attr, opts)).to.be.true;
    });
  });

  describe('#getId', function() {
    it('is the value of the id attribute', function() {
      var foo = new Foo({ id: 100, _id: 101 });

      expect(foo.getId()).to.eq(100);

      foo.idAttribute = '_id';

      expect(foo.getId()).to.eq(101);
    });

    it('caches the id attribute', function() {
      var foo = new Foo({ id: 100 });

      expect(foo.id).to.eq(100);
    });
  });

  describe('#isNew', function() {
    it('is new if it lacks a primary identifier', function() {
      var foo = new Foo();

      expect(foo.isNew()).to.be.true;

      foo.set({ id: undefined });
      expect(foo.isNew()).to.be.true;

      foo.set({ id: 100 });
      expect(foo.isNew()).to.be.false;
    });
  });

  describe('#clone', function() {
    it('creates a copy of the model\'s attributes', function() {
      var foo = new Foo({ name: 'alpha' });
      var bar = foo.clone();

      expect(bar.get('name')).to.eq(foo.get('name'));
    });
  });

  describe('#get', function() {
    it('fetches set properties', function() {
      var foo = new Foo({ name: 'alpha' });

      expect(foo.get('name')).to.eq('alpha');
    });
  });

  describe('#has', function() {
    it('is the boolean presence of an attribute', function() {
      var foo = new Foo({
        name:    'alpha',
        bool:    false,
        blank:   '',
        empty:   null,
        missing: undefined
      });

      expect(foo.has('name')).to.be.true;
      expect(foo.has('bool')).to.be.true;
      expect(foo.has('blank')).to.be.true;
      expect(foo.has('empty')).to.be.false;
      expect(foo.has('missing')).to.be.false;
    });
  });

  describe('#set', function() {
    it('sets properites in key, value form', function() {
      var foo = new Foo();

      foo.set('name', 'alpha');

      expect(foo.get('name')).to.eq('alpha');
    });

    it('sets properties from an object', function() {
      var foo = new Foo();

      foo.set({ name: 'alpha' });

      expect(foo.get('name')).to.eq('alpha');
    });

    it('triggers a change event for each property', function() {
      var foo     = new Foo({ name: 'alpha', page: 'index' }),
          nameSpy = sinon.spy(),
          pageSpy = sinon.spy(),
          anySpy  = sinon.spy();

      foo.on('change:name', nameSpy);
      foo.on('change:page', pageSpy);
      foo.on('change', anySpy);

      foo.set({ name: 'beta', page: 'title' });

      expect(nameSpy.called).to.be.true;
      expect(pageSpy.called).to.be.true;
      expect(anySpy.called).to.be.true;
    });

    it('does not trigger events when nothing changes', function() {
      var foo     = new Foo({ name: 'alpha' });
      var nameSpy = sinon.spy();
      var anySpy  = sinon.spy();

      foo.on('change:name', nameSpy);
      foo.on('change', anySpy);

      foo.set({ name: 'alpha' });

      expect(nameSpy.called).to.be.false;
      expect(anySpy.called).to.be.false;
    });
  });

  describe('#unset', function() {
    it('removes an attribute from the model', function() {
      var foo     = new Foo({ name: 'alpha' });
      var nameSpy = sinon.spy();
      var allSpy  = sinon.spy();

      foo.on('change:name', nameSpy);
      foo.on('change', allSpy);

      foo.unset('name');

      expect(foo.has('name')).to.be.false;
      expect(nameSpy.called).to.be.true;
      expect(allSpy.called).to.be.true;
    });
  });

  describe('#clear', function() {
    it('clears all attributes on the model', function() {
      var foo     = new Foo({ id: 1, name: 'alpha' });
      var nameSpy = sinon.spy();
      var anySpy  = sinon.spy();

      foo.on('change:name', nameSpy);
      foo.on('change', anySpy);

      foo.clear();

      expect(foo.get('id')).to.be.undefined;
      expect(foo.get('name')).to.be.undefined;

      expect(nameSpy.calledOnce).to.be.true;
      expect(anySpy.calledOnce).to.be.true;
    });
  });
});
