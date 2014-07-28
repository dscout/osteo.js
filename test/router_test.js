var expect = require('chai').expect;
var Router = require('../osteo-router');

describe('Router', function() {
  var Foo, PostsRoute, CommentsRoute;

  beforeEach(function() {
    Foo = Router.extend({
      map: function() {
        this.route('posts/:post_id', { to: PostsRoute }, function() {
          this.route('comments', { to: CommentsRoute });
        });
      }
    })
  });

  describe('#handle', function() {
    it('invokes the route for matching urls', function() {
      var foo = new Foo();

      foo.handle('posts/100');
    });
  });
});
