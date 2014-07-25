var expect = require('chai').expect;
var sinon  = require('sinon');
var merge  = require('../lib/merge');
var Events = require('../osteo-events');

describe('Extend', function() {
  var foo;

  beforeEach(function() {
    foo = merge({}, Events);
  });

  it('registers and listens for events', function() {
    var callbackA = sinon.spy();
    var callbackB = sinon.spy();

    foo.on('change', callbackA, this);
    foo.on('change', callbackB, this);
    foo.trigger('change', 'value');

    expect(callbackA.called).to.be.true;
    expect(callbackB.called).to.be.true;

    expect(callbackA.calledWith('value')).to.be.true;
    expect(callbackB.calledWith('value')).to.be.true;
  });

  it('removes registered event listeners', function() {
    var callbackA = sinon.spy();
    var callbackB = sinon.spy();

    foo.on('change', callbackA, this);
    foo.on('change', callbackB, this);
    foo.trigger('change');

    foo.off('change', callbackA, this);
    foo.trigger('change');

    expect(callbackA.calledOnce).to.be.true
    expect(callbackB.calledTwice).to.be.true

    foo.off('change', null, null);
    foo.trigger('change');

    expect(callbackB.calledTwice).to.be.true
  });

  it('ignores triggering without any listeners', function() {
    trigger = function() {
      foo.trigger('change:field')
    }

    expect(trigger).not.to.throw(Error);
  });
});
