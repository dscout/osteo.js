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

  it('associates multiple existing objects through hasMany', function() {
    store
      .add('tags',  { id: 1, name: 'alpha' })
      .add('tags',  { id: 2, name: 'beta'  })
      .add('notes', { id: 1, author: 'pk' });

    var submission = new Submission({
      tag_ids:  [1, 2],
      note_ids: [1]
    });

    expect(submission.tags()).to.exist;
    expect(submission.tags()).to.have.length(2);
    expect(submission.tags()).to.eql([
      { id: 1, name: 'alpha' },
      { id: 2, name: 'beta' }
    ]);

    expect(submission.notes()).to.exist;
    expect(submission.notes()).to.have.length(1);
    expect(submission.notes()).to.eql([
      { id: 1, author: 'pk' }
    ]);
  });

  it('associates a single object through hasOne', function() {
    store.add('authors', { id: 1, name: 'John Doe' });

    var submission = new Submission({
      author_id: 1
    });

    expect(submission.author()).to.exist;
    expect(submission.author()).to.eql({ id: 1, name: 'John Doe' });
  });
});
