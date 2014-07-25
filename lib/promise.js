/*!
**  Thenable -- Embeddable Minimum Strictly-Compliant Promises/A+ 1.1.1 Thenable
**  Copyright (c) 2013-2014 Ralf S. Engelschall <http://engelschall.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Source-Code distributed on <http://github.com/rse/thenable>
*/

var thenable = function(root) {
  var STATE_PENDING   = 0;
  var STATE_FULFILLED = 1;
  var STATE_REJECTED  = 2;

  var api = function (executor) {
    if (!(this instanceof api)) {
      return new api(executor);
    }

    this.id           = "Thenable/1.0.6";
    this.state        = STATE_PENDING;
    this.fulfillValue = undefined;
    this.rejectReason = undefined;
    this.onFulfilled  = [];
    this.onRejected   = [];

    this.proxy = {
      then: this.then.bind(this)
    };

    if (typeof executor === "function")
      executor.call(this, this.fulfill.bind(this), this.reject.bind(this));
  };

  api.prototype = {
    fulfill: function (value) { return deliver(this, STATE_FULFILLED, "fulfillValue", value); },
    reject:  function (value) { return deliver(this, STATE_REJECTED,  "rejectReason", value); },

    then: function (onFulfilled, onRejected) {
      var curr = this;
      var next = new api();
      curr.onFulfilled.push(resolver(onFulfilled, next, "fulfill"));
      curr.onRejected.push(resolver(onRejected,  next, "reject" ));
      execute(curr);

      return next.proxy;
    }
  };

  var deliver = function (curr, state, name, value) {
    if (curr.state === STATE_PENDING) {
      curr.state = state;
      curr[name] = value;
      execute(curr);
    }

    return curr;
  };

  var execute = function (curr) {
    if (curr.state === STATE_FULFILLED)
      execute_handlers(curr, "onFulfilled", curr.fulfillValue);
    else if (curr.state === STATE_REJECTED)
      execute_handlers(curr, "onRejected",  curr.rejectReason);
  };

  var execute_handlers = function (curr, name, value) {
    if (curr[name].length === 0)
      return;

    var handlers = curr[name];
    curr[name] = [];
    var func = function () {
      for (var i = 0; i < handlers.length; i++)
        handlers[i](value);
    };

    if (typeof process === "object" && typeof process.nextTick === "function")
      process.nextTick(func);
    else if (typeof setImmediate === "function")
      setImmediate(func);
    else
      setTimeout(func, 0);
  };

  var resolver = function (cb, next, method) {
    return function (value) {
      if (typeof cb !== "function")
        next[method].call(next, value);
      else {
        var result;
        try { result = cb(value); }
        catch (e) {
          next.reject(e);
          return;
        }
        resolve(next, result);
      }
    };
  };

  var resolve = function (promise, x) {
    if (promise === x || promise.proxy === x) {
      promise.reject(new TypeError("cannot resolve promise with itself"));
      return;
    }

    var then;
    if ((typeof x === "object" && x !== null) || typeof x === "function") {
      try { then = x.then; }
      catch (e) {
        promise.reject(e);
        return;
      }
    }

    if (typeof then === "function") {
      var resolved = false;
      try {
        then.call(x,
          function (y) {
            if (resolved) return; resolved = true;
            if (y === x)
              promise.reject(new TypeError("circular thenable chain"));
            else
              resolve(promise, y);
          },

          function (r) {
            if (resolved) return; resolved = true;
            promise.reject(r);
          }
        );
      }
      catch (e) {
        if (!resolved)
          promise.reject(e);
      }
      return;
    }

    promise.fulfill(x);
  };

  return api;
};

module.exports = thenable(this);
