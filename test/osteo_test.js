var expect = require('chai').expect;
var Osteo  = require('../osteo');

describe('Osteo', function() {
  it('defines all sub-modules on the required object', function() {
    expect(Osteo.Collection).not.to.be.undefined;
    expect(Osteo.Model).not.to.be.undefined;
  });
});
