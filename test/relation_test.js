var chai     = require('chai').expect;
var merge    = require('../lib/utils/merge');
var Store    = require('../lib/Store');
var Relation = require('../lib/Relation');

describe('Relation', function() {
  var store = new Store();
  var Submission = function(attributes) {
    this.attributes = attributes;
  };

  merge(Submission.prototype, {
    store:  store,
    notes:  Relation.hasMany('note'),
    tags:   Relation.hasMany('tag'),
    author: Relation.hasOne('author'),

    get: function(key) {
      return this.attributes[key];
    }
  });

  it('associates multiple existing objects through hasMany', function(done) {
    store
      .add('tags', { id: 1, name: 'alpha' })
      .add('tags', { id: 2, name: 'beta'  })

    var submission = new Submission({
      tag_ids:  [1, 2],
      note_ids: [1]
    });

    submission.tags().then(function(tags) {
      expect(tags).to.exist;
      expect(tags).to.have.length(2);
      expect(tags).to.eql([
        { id: 1, name: 'alpha' },
        { id: 2, name: 'beta' }
      ]);
      done();
    });
  });

  it('associates a single object through hasOne', function(done) {
    store.add('authors', { id: 1, name: 'John Doe' });

    var submission = new Submission({
      author_id: 1
    });

    submission.author().then(function(author) {
      expect(author).to.exist;
      expect(author).to.eql({ id: 1, name: 'John Doe' });
      done();
    });
  });
});
