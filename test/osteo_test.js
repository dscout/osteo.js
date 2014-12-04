var expect = require('chai').expect;
var Osteo  = require('../osteo');

describe('Osteo', function() {
  it('defines all sub-modules on the required object', function() {
    expect(Osteo.Model).not.to.be.undefined;
  });
});
