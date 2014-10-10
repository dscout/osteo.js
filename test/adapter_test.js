var chai    = require('chai').expect;
var Adapter = require('../lib/Adapter');

describe('Adapter', function() {
  var server;

  beforeEach(function() {
    server = sinon.fakeServer.create();
  });

  afterEach(function() {
    server.restore();
  });

  describe('#sync', function() {
    it('peforms a GET request with object URL', function(done) {
      server.respondWith('GET', '/comments/1', [
        200, { 'Content-Type': 'application/json' },
        '{"id": 12}'
      ]);

      var adapter = new Adapter();
      var model   = { url: function() {
          return '/comments/1'
        }
      };

      adapter.sync('read', model).then(function(response) {
        expect(response.body).to.eql({ id: 12 });
        done();
      });

      server.respond();
    });

    it('performs a POST request with model JSON', function(done) {
      server.respondWith('POST', '/comments', [
        200, { 'Content-Type': 'application/json' },
        '{"id": 12,"body":"Yay!"}'
      ]);

      var adapter = new Adapter();
      var model   = {
        url:  function() { return '/comments'; },
        dump: function() { return { body: 'Yay!' } }
      };

      adapter.sync('create', model).then(function(response) {
        expect(response.body).to.eql({ id: 12, body: 'Yay!' });
        done();
      });

      server.respond();
    });
  });
});
