var expect = require('chai').expect;
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
  });
});
