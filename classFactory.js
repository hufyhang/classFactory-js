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

  return function classFactory(parent, define) {
      if (typeof parent !== 'function') {
        throw TypeError(parent + ' is not a function');
      }

      if (typeof define !== 'function') {
        define = parent;
        parent = undefined;
      }

      // Define an empty class.
      var F,
        proto = {};

      define.call(proto, parent);
      if (!hasOwn.call(proto, 'constructor')) {
        proto.constructor = function() {};
      }
      F = proto.constructor;

      if (typeof parent === 'function') {
        F.prototype = new parent();
      }
      for (var k in proto) {
        if (hasOwn.call(proto, k)) {
          F.prototype[k] = proto[k];
        }
      }

      return F;
    };

} )()

);

