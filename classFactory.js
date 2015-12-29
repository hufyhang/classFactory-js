'use strict';
( function (definition) {
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = definition;
  }
  else {
    Object.classFactory = definition;
  }
} )(

( function () {
  var hasOwn = Object.prototype.hasOwnProperty;

  function clone(o) {
    if (o === null || o === undefined || typeof o !== 'object') {
      return o;
    }
    var temp = o.constructor();
    for (var k in o) {
      if (hasOwn.call(o, k)) {
        temp[k] = clone(o[k]);
      }
    }
    return temp;
  }

  function extend(a, b) {
    for (var k in b) {
      a[k] = clone(b[k]);
    }
    return a;
  }

  return function classFactory(parents, define) {
      if (typeof parents !== 'function' &&
          Object.prototype.toString.call(parents) !== '[object Array]') {
        throw TypeError(parents + ' is neither a function nor an array');
      }

      if (typeof define !== 'function') {
        define = parents;
        parents = [];
      }

      // Make sure parents is an array.
      parents = [].concat(parents);

      try {
        parents = Array.prototype.map.call(parents, function (parent) {
          return parent.constructor;
        });
      } catch (e) {
        throw TypeError('Invalid parent function');
      }

      var F,
        proto = {};

      define.apply(proto, parents);
      if (!hasOwn.call(proto, 'constructor')) {
        proto.constructor = function() {};
      }
      F = proto.constructor;

      for (var i = 0, l = parents.length; i !== l; ++i) {
        F.prototype = extend(F.prototype, parents[i].prototype);
      }

      for (var k in proto) {
        if (hasOwn.call(proto, k)) {
          F.prototype[k] = proto[k];
        }
      }

      return {
        constructor: F,
        definition: define,
        parents: parents,
        create: function () {
          var args = Array.prototype.slice.call(arguments);
          args = [F].concat(args);
          return new (Function.prototype.bind.apply(F, args))();
        }
      };
    };

} )()

);

