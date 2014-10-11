var expect = require('chai').expect;
var Store  = require('../lib/Store');

describe('Store', function() {
  describe('#add', function() {
    it('stores the object within a particular namespace', function() {
      var store  = new Store();
      var result = store.add('tags', { id: 100 });

      expect(result).to.eql(store);
    });
  });

  describe('#find', function() {
    it('retrieves a stored object', function() {
      var store  = new Store();
      var object = { id: 100 };
      store.add('tags', object);

      expect(store.find('tags', 100)).to.eql(object);
    });
  });

  describe('#all', function() {
    it('retrieves all objects stored within a namespace', function() {
      var store = new Store();
      store.add('tags', { id: 100 });

      expect(store.all('tags')).to.have.length(1);
    });
  });

  describe('#some', function() {
    it('retrieves each from a list of ids', function() {
      var store   = new Store();
      var objectA = { id: 100 };
      var objectB = { id: 101 };

      store
        .add('tags', objectA)
        .add('tags', objectB);

      expect(store.some('tags', [100, 101])).to.eql([objectA, objectB])
    });
  });

  describe('#count', function() {
    it('counts the number of objects within a namespace', function() {
      var store = new Store();

      expect(store.count('tags')).to.eq(0);

      store.add('tags', { id: 100 });

      expect(store.count('tags')).to.eq(1);
    });
  });

  describe('#parse', function() {
    var payload = {
      authors:  [{ id: 1 }],
      comments: [{ id: 1 }, { id: 2 }],
      posts:    [{ id: 1 }, { id: 2 }]
    }

    it('extracts a payload of rooted arrays into corresponding buckets', function() {
      var store = new Store();

      store.parse(payload);

      expect(store.count('authors')).to.eq(1);
      expect(store.count('comments')).to.eq(2);
      expect(store.count('posts')).to.eq(2);
    });
  });
});
