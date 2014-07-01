var expect = require('chai').expect;
var sinon  = require('sinon');
var Model  = require('../osteo-model');

describe('Model', function() {
  var Foo = Model.extend({
  })

  describe('#get', function() {
    it('fetches set properties', function() {
      var foo = new Foo({ name: 'alpha' });

      expect(foo.get('name')).to.eq('alpha');
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
      var foo     = new Foo({ name: 'alpha' }),
          nameSpy = sinon.spy(),
          anySpy  = sinon.spy();

      foo.on('change:name', nameSpy);
      foo.on('change', anySpy);

      foo.set({ name: 'alpha' });

      expect(nameSpy.called).to.be.false;
      expect(anySpy.called).to.be.false;
    });
  });
});
