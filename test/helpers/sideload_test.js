describe('Osteo.Sideload', function() {
  describe('.associate', function() {
    it('re-associates sideloaded objects with the root objects', function() {
      var payload, associated;

      payload = {
        posts: [
          { id: 1, tag_ids: [1, 2], comment_ids: [1] },
          { id: 2, tag_ids: [3], comment_ids: [] }
        ],
        tags:     [{ id: 1 }, { id: 2 }, { id: 3 }],
        comments: [{ id: 1 }]
      };

      associated = Osteo.Sideload.associate(payload, 'posts');

      expect(associated[0].tags).to.eql([{ id: 1 }, { id: 2 }]);
      expect(associated[1].tags).to.eql([{ id: 3 }]);
      expect(associated[0].comments).to.eql([{ id: 1 }]);
      expect(associated[1].comments).to.eql([]);
    });

    it('associates with a single root object', function() {
      var payload, associated;

      payload = {
        post:     { id: 1, tag_ids: [1, 2], comment_ids: [1] },
        tags:     [{ id: 1 }, { id: 2 }],
        comments: [{ id: 1 }]
      };

      associated = Osteo.Sideload.associate(payload, 'post');

      expect(associated.length).to.eq(1);
      expect(associated[0].tags).to.eql([{ id: 1 }, { id: 2 }]);
    });

    it('associates a single object', function() {
      var payload, associated;

      payload = {
        post:    { id: 1, author_id: 17 },
        authors: [{ id: 17 }]
      };

      associated = Osteo.Sideload.associate(payload, 'post');

      expect(associated[0].authors).to.eql([{ id: 17 }]);
    });
  });
});
